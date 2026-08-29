(async () => {
  try {
    const { User, Student, MentoringMinute, sequelize } = require("../models");
    const bcrypt = require("bcryptjs");

    // Create test user with mentoring minute
    const tx0 = await sequelize.transaction();
    let user, student;
    try {
      user = await User.create(
        {
          username: "debugdel_" + Date.now(),
          role: "student",
          password_hash: await bcrypt.hash("password", 10),
        },
        { transaction: tx0 },
      );
      student = await Student.create(
        {
          uid: "DBG" + Date.now(),
          first_name: "Dbg",
          last_name: "Delete",
          semester: 1,
          section: "A",
          year_of_admission: 2024,
          user_id: user.id,
        },
        { transaction: tx0 },
      );
      await MentoringMinute.create(
        {
          student_id: student.id,
          semester: 1,
          date: new Date(),
          remarks: "Debug",
        },
        { transaction: tx0 },
      );
      await tx0.commit();
    } catch (e) {
      await tx0.rollback();
      console.error("Failed creating test user", e);
      process.exit(1);
    }

    console.log("Created user", user.id, "student", student.id);

    // Now attempt deletion logic inside transaction like controller
    try {
      const tx = await sequelize.transaction();
      try {
        // No faculty case
        if (user.role === "faculty" && user.faculty_profile) {
          await Student.update(
            { mentor_id: null },
            { where: { mentor_id: user.faculty_profile.id }, transaction: tx },
          );
          await user.faculty_profile.destroy({ transaction: tx });
        }

        if (user.role === "student" && student) {
          await student.destroy({ transaction: tx });
        }

        await user.destroy({ transaction: tx });
        await tx.commit();
        console.log("Programmatic delete succeeded");
      } catch (deleteError) {
        await tx.rollback();
        console.error(
          "Programmatic delete failed:",
          deleteError && deleteError.name,
          deleteError && deleteError.message,
        );
        if (deleteError && deleteError.parent)
          console.error("Parent detail:", deleteError.parent);
      }
    } catch (outerErr) {
      console.error("Outer err", outerErr);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
