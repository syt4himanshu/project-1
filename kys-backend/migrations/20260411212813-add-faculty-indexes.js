'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('students', ['id'], {
      name: 'idx_students_id'
    });
    
    await queryInterface.addIndex('students', ['mentor_id'], {
      name: 'idx_students_mentor_id'
    });

    await queryInterface.addIndex('mentoring_minutes', ['student_id', 'date'], {
      name: 'idx_mentoring_minutes_student_date'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('students', 'idx_students_id');
    await queryInterface.removeIndex('students', 'idx_students_mentor_id');
    await queryInterface.removeIndex('mentoring_minutes', 'idx_mentoring_minutes_student_date');
  }
};
