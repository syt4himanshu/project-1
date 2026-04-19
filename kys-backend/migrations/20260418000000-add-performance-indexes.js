/**
 * Migration: Add performance indexes
 * 
 * Adds indexes on frequently queried fields to improve query performance
 */

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add index on student.mentor_id (used in WHERE clauses for faculty queries)
        await queryInterface.addIndex('student', ['mentor_id'], {
            name: 'idx_student_mentor_id',
            where: { mentor_id: { [Sequelize.Op.ne]: null } }, // Partial index for non-null values
        });

        // Add index on student.user_id (used in WHERE clauses for user lookups)
        await queryInterface.addIndex('student', ['user_id'], {
            name: 'idx_student_user_id',
            unique: true,
        });

        // Add index on faculty.user_id (used in WHERE clauses for user lookups)
        await queryInterface.addIndex('faculty', ['user_id'], {
            name: 'idx_faculty_user_id',
            unique: true,
        });

        // Add composite index on mentoring_minute for common queries
        await queryInterface.addIndex('mentoring_minute', ['student_id', 'date'], {
            name: 'idx_mentoring_minute_student_date',
        });

        // Add index on mentoring_minute.faculty_id
        await queryInterface.addIndex('mentoring_minute', ['faculty_id'], {
            name: 'idx_mentoring_minute_faculty_id',
        });

        // Add composite index on student for filtering by semester and section
        await queryInterface.addIndex('student', ['semester', 'section'], {
            name: 'idx_student_semester_section',
        });

        // Add index on student.year_of_admission for filtering
        await queryInterface.addIndex('student', ['year_of_admission'], {
            name: 'idx_student_year_of_admission',
        });

        // Add index on user.username for login queries
        await queryInterface.addIndex('user', ['username'], {
            name: 'idx_user_username',
        });

        // Add index on user.role for role-based queries
        await queryInterface.addIndex('user', ['role'], {
            name: 'idx_user_role',
        });

        console.log('✓ Performance indexes added successfully');
    },

    async down(queryInterface, Sequelize) {
        // Remove indexes in reverse order
        await queryInterface.removeIndex('user', 'idx_user_role');
        await queryInterface.removeIndex('user', 'idx_user_username');
        await queryInterface.removeIndex('student', 'idx_student_year_of_admission');
        await queryInterface.removeIndex('student', 'idx_student_semester_section');
        await queryInterface.removeIndex('mentoring_minute', 'idx_mentoring_minute_faculty_id');
        await queryInterface.removeIndex('mentoring_minute', 'idx_mentoring_minute_student_date');
        await queryInterface.removeIndex('faculty', 'idx_faculty_user_id');
        await queryInterface.removeIndex('student', 'idx_student_user_id');
        await queryInterface.removeIndex('student', 'idx_student_mentor_id');

        console.log('✓ Performance indexes removed');
    },
};
