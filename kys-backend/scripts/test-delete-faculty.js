(async () => {
  try {
    const jwt = require("jsonwebtoken");
    const {
      User,
      Faculty,
      Student,
      MentoringMinute,
      sequelize,
    } = require("../models");
    const bcrypt = require("bcryptjs");
    const fetch =
      global.fetch || (await import("node-fetch").then((m) => m.default));

    const token = jwt.sign(
      {
        sub: "1",
        role: "admin",
        username: "admin",
        jti: require("crypto").randomUUID(),
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );
    console.log("ADMIN_TOKEN=" + token);

    const tx = await sequelize.transaction();
    try {
      const facultyUser = await User.create(
        {
          username: "facdel_" + Date.now(),
          role: "faculty",
          password_hash: await bcrypt.hash("password", 10),
        },
        { transaction: tx },
      );
      const faculty = await Faculty.create(
        {
          email: "fac" + Date.now() + "@stvincentngp.edu.in",
          first_name: "Fac",
          last_name: "Delete",
          contact_number: "1234567890",
          user_id: facultyUser.id,
        },
        { transaction: tx },
      );

      const studentUser = await User.create(
        {
          username: "studforfac_" + Date.now(),
          role: "student",
          password_hash: await bcrypt.hash("password", 10),
        },
        { transaction: tx },
      );
      const student = await Student.create(
        {
          uid: "SF" + Date.now(),
          first_name: "Sfor",
          last_name: "Fac",
          semester: 1,
          section: "A",
          year_of_admission: 2024,
          user_id: studentUser.id,
          mentor_id: faculty.id,
        },
        { transaction: tx },
      );

      await MentoringMinute.create(
        {
          student_id: student.id,
          faculty_id: faculty.id,
          semester: 1,
          date: new Date(),
          remarks: "From faculty",
        },
        { transaction: tx },
      );

      await tx.commit();
      console.log("Created faculty", faculty.id, "and student", student.id);

      const res = await fetch(
        `http://localhost:${process.env.PORT || 5002}/api/admin/users/${
          facultyUser.id
        }`,
        { method: "DELETE", headers: { Authorization: "Bearer " + token } },
      );
      const text = await res.text();
      console.log("Status", res.status, "Body", text);
    } catch (e) {
      await tx.rollback();
      console.error("Error creating test data", e);
      process.exit(1);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
