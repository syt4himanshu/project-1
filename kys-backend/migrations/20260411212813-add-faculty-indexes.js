'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Student', ['id'], {
      name: 'idx_students_id'
    });
    
    await queryInterface.addIndex('Student', ['mentor_id'], {
      name: 'idx_students_mentor_id'
    });

    await queryInterface.addIndex('MentoringMinute', ['student_id', 'date'], {
      name: 'idx_mentoring_minutes_student_date'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Student', 'idx_students_id');
    await queryInterface.removeIndex('Student', 'idx_students_mentor_id');
    await queryInterface.removeIndex('MentoringMinute', 'idx_mentoring_minutes_student_date');
  }
};
