(async () => {
  try {
    const jwt = require("jsonwebtoken");
    const { User, Student, sequelize } = require("../models");
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
      const user = await User.create(
        {
          username: "tempdel_" + Date.now(),
          role: "student",
          password_hash: await bcrypt.hash("password", 10),
        },
        { transaction: tx },
      );

      const student = await Student.create(
        {
          uid: "TEMPUID" + Date.now(),
          first_name: "Temp",
          last_name: "Delete",
          semester: 1,
          section: "A",
          year_of_admission: 2024,
          user_id: user.id,
        },
        { transaction: tx },
      );

      // Add a mentoring minute to create a dependent record
      const { MentoringMinute } = require("../models");
      await MentoringMinute.create(
        {
          student_id: student.id,
          semester: 1,
          date: new Date(),
          remarks: "Test remark",
        },
        { transaction: tx },
      );

      await tx.commit();
      console.log("Created user", user.id);

      const res = await fetch(
        `http://localhost:${process.env.PORT || 5002}/api/admin/users/${
          user.id
        }`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        },
      );
      const text = await res.text();
      console.log("Status", res.status, "Body", text);
    } catch (e) {
      await tx.rollback();
      console.error("Error in transaction", e);
      process.exit(1);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
