const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sequelize, User, Student, Faculty } = require('../models');
const { splitFullName } = require('../utils/helpers');
const { addJti } = require('../utils/jwtBlacklist');

// Verify password against both bcrypt ($2b$) and Werkzeug scrypt (scrypt:N:r:p$salt$hash) formats
const verifyPassword = async (password, hash) => {

  if (hash.startsWith('$2b$') || hash.startsWith('$2a$')) {
    return await bcrypt.compare(password, hash);
  }
  if (hash.startsWith('scrypt:')) {
    return new Promise((resolve) => {
      try {
        const parts = hash.split('$');
        const params = parts[0].split(':');
        const N = parseInt(params[1]);
        const r = parseInt(params[2]);
        const p = parseInt(params[3]);
        const salt = Buffer.from(parts[1], 'utf8');
        const storedKey = parts[2];
        const keylen = storedKey.length / 2;
        crypto.scrypt(password, salt, keylen, { N, r, p, maxmem: 256 * 1024 * 1024 }, (err, derived) => {
          if (err) return resolve(false);
          resolve(derived.toString('hex') === storedKey);
        });
      } catch (_) {
        resolve(false);
      }
    });
  }
  return Promise.resolve(false);
};

const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
      username: user.username,
      jti: crypto.randomUUID(),
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' },
  );

const MAX_BULK_BATCH_SIZE = 500;

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const parseBoundedInteger = (value, min, max) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return null;
  return parsed;
};

const hasMinimumPasswordLength = (value, minLength = 6) =>
  typeof value === 'string' && value.length >= minLength;

const hasValidContactNumber = (value) => String(value || '').replace(/\D/g, '').length >= 10;

const isValidFacultyEmail = (value) => normalizeText(value).endsWith('@stvincentngp.edu.in');

const login = async (req, res, next) => {
  try {
    const data = req.body || {};

    const username = data.username || data.uid;
    const password = data.password;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await verifyPassword(password || '', user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signAccessToken(user);
    return res.json({
      access_token: token,
      role: user.role,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    return next(error);
  }
};

const verify = async (req, res) => {
  if (!req.currentUser) return res.status(401).json({ valid: false });

  return res.status(200).json({
    valid: true,
    user: {
      id: req.currentUser.id,
      username: req.currentUser.username,
      role: req.currentUser.role,
    },
  });
};

const verifyAlias = async (req, res) => {
  if (!req.currentUser) return res.status(401).json({ valid: false });

  return res.status(200).json({
    valid: true,
    user: {
      id: req.currentUser.id,
      username: req.currentUser.username,
      role: req.currentUser.role,
    },
  });
};

const register = async (req, res, next) => {
  try {
    const data = req.body || {};
    const role = data.role;

    if (role === 'student') {
      const { uid, full_name, semester, section, year_of_admission } = data;
      if (!uid || !full_name) return res.status(400).json({ error: 'Missing UID or full_name' });
      if (await User.findOne({ where: { username: uid } })) {
        return res.status(400).json({ error: 'Student with given UID already exists' });
      }

      const names = splitFullName(full_name);
      const user = await User.create({
        username: uid,
        role: 'student',
        password_hash: await bcrypt.hash(uid, 10),
      });

      const student = await Student.create({
        uid,
        first_name: names.first_name,
        middle_name: names.middle_name,
        last_name: names.last_name,
        semester,
        section,
        year_of_admission,
        user_id: user.id,
      });

      return res.status(201).json({
        message: 'Student created successfully',
        student_profile: 'created',
        user: {
          uid,
          full_name,
          first_name: student.first_name,
          middle_name: student.middle_name,
          last_name: student.last_name,
          semester: student.semester,
          section: student.section,
          year_of_admission: student.year_of_admission,
        },
      });
    }

    if (role === 'faculty') {
      const email = data.email;
      const first_name = data.first_name;
      const last_name = data.last_name;
      const contact_number = data.contact_number;
      const password = data.password || crypto.randomBytes(8).toString('hex');

      if (!email || !first_name || !last_name) {
        return res.status(400).json({ error: 'Missing email, first_name, or last_name' });
      }
      if (!email.endsWith('@stvincentngp.edu.in')) {
        return res.status(400).json({ error: 'Invalid email format, must end with @stvincentngp.edu.in' });
      }
      if (await User.findOne({ where: { username: email } })) {
        return res.status(400).json({ error: 'Faculty with given email already exists' });
      }

      const user = await User.create({
        username: email,
        role: 'faculty',
        password_hash: await bcrypt.hash(password, 10),
      });

      await Faculty.create({ email, first_name, last_name, contact_number, user_id: user.id });

      return res.status(201).json({
        message: 'Faculty created successfully',
        faculty_profile: 'created',
        temp_password: data.password ? undefined : password,
        user: { email, first_name, last_name, contact_number },
      });
    }

    return res.status(400).json({ error: 'Invalid role' });
  } catch (error) {
    return next(error);
  }
};

const registerBulkStudents = async (req, res, next) => {
  try {
    const students = req.body;
    if (!Array.isArray(students)) return res.status(400).json({ error: 'Input must be a list of students' });
    if (!students.length) return res.status(400).json({ error: 'At least one student record is required' });
    if (students.length > MAX_BULK_BATCH_SIZE) {
      return res.status(400).json({ error: `Maximum ${MAX_BULK_BATCH_SIZE} student rows allowed per upload` });
    }

    const results = [];

    for (const entry of students) {
      const uid = normalizeText(entry?.uid);
      const fullName = normalizeText(entry?.full_name || entry?.name);
      const semester = parseBoundedInteger(entry?.semester, 1, 8);
      const section = normalizeText(entry?.section);
      const yearOfAdmission = parseBoundedInteger(entry?.year_of_admission, 2000, 2100);

      if (!uid) {
        results.push({ uid: null, status: 'failed', error: 'Missing UID' });
        continue;
      }
      if (!fullName) {
        results.push({ uid, status: 'failed', error: 'Missing full_name' });
        continue;
      }
      if (semester == null) {
        results.push({ uid, status: 'failed', error: 'semester must be between 1 and 8' });
        continue;
      }
      if (!section) {
        results.push({ uid, status: 'failed', error: 'Missing section' });
        continue;
      }
      if (yearOfAdmission == null) {
        results.push({ uid, status: 'failed', error: 'year_of_admission must be between 2000 and 2100' });
        continue;
      }

      const [existingUser, existingStudent] = await Promise.all([
        User.findOne({ where: { username: uid, role: 'student' } }),
        Student.findOne({ where: { uid } }),
      ]);
      if (existingUser || existingStudent) {
        results.push({ uid, status: 'failed', error: 'UID already exists' });
        continue;
      }

      try {
        await sequelize.transaction(async (tx) => {
          const names = splitFullName(fullName);
          const user = await User.create(
            { username: uid, role: 'student', password_hash: await bcrypt.hash(uid, 10) },
            { transaction: tx },
          );

          await Student.create(
            {
              uid,
              first_name: names.first_name,
              middle_name: names.middle_name,
              last_name: names.last_name,
              semester,
              section,
              year_of_admission: yearOfAdmission,
              user_id: user.id,
            },
            { transaction: tx },
          );
        });

        results.push({ uid, status: 'success' });
      } catch (_error) {
        results.push({ uid, status: 'failed', error: 'Could not create student record' });
      }
    }

    return res.status(200).json({ result: results });
  } catch (error) {
    return next(error);
  }
};

const registerBulkFaculty = async (req, res, next) => {
  try {
    const faculties = req.body;
    if (!Array.isArray(faculties)) {
      return res.status(400).json({ error: 'Input must be a list of faculty members' });
    }
    if (!faculties.length) {
      return res.status(400).json({ error: 'At least one faculty record is required' });
    }
    if (faculties.length > MAX_BULK_BATCH_SIZE) {
      return res.status(400).json({ error: `Maximum ${MAX_BULK_BATCH_SIZE} faculty rows allowed per upload` });
    }

    const results = [];

    for (const entry of faculties) {
      const email = normalizeText(entry?.email);
      const suppliedPassword = typeof entry?.password === 'string' ? entry.password : undefined;
      const password = suppliedPassword || crypto.randomBytes(8).toString('hex');
      const first_name = normalizeText(entry?.first_name);
      const last_name = normalizeText(entry?.last_name);
      const contact_number = normalizeText(entry?.contact_number);

      if (!email || !isValidFacultyEmail(email)) {
        results.push({ email, status: 'failed', error: 'Invalid email format' });
        continue;
      }
      if (!first_name || !last_name) {
        results.push({ email, status: 'failed', error: 'Missing first_name or last_name' });
        continue;
      }
      if (contact_number && !hasValidContactNumber(contact_number)) {
        results.push({ email, status: 'failed', error: 'contact_number must contain at least 10 digits' });
        continue;
      }
      if (suppliedPassword && !hasMinimumPasswordLength(suppliedPassword)) {
        results.push({ email, status: 'failed', error: 'password must be at least 6 characters long' });
        continue;
      }

      const [existingUser, existingFaculty] = await Promise.all([
        User.findOne({ where: { username: email } }),
        Faculty.findOne({ where: { email } }),
      ]);
      if (existingUser || existingFaculty) {
        results.push({ email, status: 'failed', error: 'Faculty with given email already exists' });
        continue;
      }

      try {
        await sequelize.transaction(async (tx) => {
          const user = await User.create(
            { username: email, role: 'faculty', password_hash: await bcrypt.hash(password, 10) },
            { transaction: tx },
          );

          await Faculty.create({ email, first_name, last_name, contact_number, user_id: user.id }, { transaction: tx });
        });

        results.push({
          email,
          status: 'success',
          temp_password: suppliedPassword ? undefined : password,
        });
      } catch (_error) {
        results.push({ email, status: 'failed', error: 'Could not create faculty record' });
      }
    }

    return res.status(200).json({ result: results });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body || {};
    const user = req.currentUser;

    const oldValid = await verifyPassword(old_password || '', user.password_hash);
    if (!oldValid) return res.status(400).json({ error: 'Old password incorrect' });

    if (await verifyPassword(new_password || '', user.password_hash)) {
      return res.status(400).json({ error: 'New password cannot be the same as the old password' });
    }

    if ((new_password || '').length < 8) {
      return res.status(400).json({ error: 'The password must be of minimum 8 characters' });
    }

    user.password_hash = await bcrypt.hash(new_password, 10);
    await user.save();

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res) => {
  if (req.jwtPayload?.jti) addJti(req.jwtPayload.jti);
  return res.status(200).json({ message: 'Successfully logged out' });
};

module.exports = {
  login,
  verify,
  verifyAlias,
  register,
  registerBulkStudents,
  registerBulkFaculty,
  changePassword,
  logout,
};
