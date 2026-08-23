"use strict";

const DRAFT_FIELDS = {
  mobile_no: "STRING(20)",
  personal_email: "STRING(255)",
  college_email: "STRING(255)",
  linked_in_id: "STRING(255)",
  permanent_address: "TEXT",
  dob: "DATEONLY",
  gender: "STRING(10)",
  father_name: "STRING(120)",
  father_mobile_no: "STRING(20)",
  father_occupation: "STRING(255)",
  mother_name: "STRING(120)",
  mother_mobile_no: "STRING(20)",
  mother_occupation: "STRING(255)",
  emergency_contact_name: "STRING(120)",
  emergency_contact_number: "STRING(20)",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const [field, type] of Object.entries(DRAFT_FIELDS)) {
      await queryInterface.changeColumn("student_personal_info", field, {
        type: Sequelize[type.split("(")[0]](
          ...(type.match(/\((.*)\)/)?.[1] ? [type.match(/\((.*)\)/)[1]] : []),
        ),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    for (const [field, type] of Object.entries(DRAFT_FIELDS)) {
      await queryInterface.changeColumn("student_personal_info", field, {
        type: Sequelize[type.split("(")[0]](
          ...(type.match(/\((.*)\)/)?.[1] ? [type.match(/\((.*)\)/)[1]] : []),
        ),
        allowNull: false,
      });
    }
  },
};
