/**
 * Migration: Add performance indexes
 * 
 * Adds indexes on frequently queried fields to improve query performance
 */

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const safeAddIndex = async (tableName, fields, options) => {
            const indexes = await queryInterface.showIndex(tableName);
            const indexExists = indexes.some(idx => idx.name === options.name);
            if (!indexExists) {
                await queryInterface.addIndex(tableName, fields, options);
                console.log(`Added index ${options.name} to ${tableName}`);
            } else {
                console.log(`Index ${options.name} already exists on ${tableName}, skipping.`);
            }
        };

        // Add index on student.mentor_id (used in WHERE clauses for faculty queries)
        await safeAddIndex('student', ['mentor_id'], {
            name: 'idx_student_mentor_id',
            where: { mentor_id: { [Sequelize.Op.ne]: null } }, // Partial index for non-null values
        });

        // Add index on student.user_id (used in WHERE clauses for user lookups)
        await safeAddIndex('student', ['user_id'], {
            name: 'idx_student_user_id',
            unique: true,
        });

        // Add index on faculty.user_id (used in WHERE clauses for user lookups)
        await safeAddIndex('faculty', ['user_id'], {
            name: 'idx_faculty_user_id',
            unique: true,
        });

        // Add composite index on mentoring_minute for common queries
        await safeAddIndex('mentoring_minute', ['student_id', 'date'], {
            name: 'idx_mentoring_minute_student_date',
        });

        // Add index on mentoring_minute.faculty_id
        await safeAddIndex('mentoring_minute', ['faculty_id'], {
            name: 'idx_mentoring_minute_faculty_id',
        });

        // Add composite index on student for filtering by semester and section
        await safeAddIndex('student', ['semester', 'section'], {
            name: 'idx_student_semester_section',
        });

        // Add index on student.year_of_admission for filtering
        await safeAddIndex('student', ['year_of_admission'], {
            name: 'idx_student_year_of_admission',
        });

        // Add index on user.username for login queries
        await safeAddIndex('user', ['username'], {
            name: 'idx_user_username',
        });

        // Add index on user.role for role-based queries
        await safeAddIndex('user', ['role'], {
            name: 'idx_user_role',
        });
    },

    async down(queryInterface, Sequelize) {
        const safeRemoveIndex = async (tableName, indexName) => {
            try {
                const indexes = await queryInterface.showIndex(tableName);
                const indexExists = indexes.some(idx => idx.name === indexName);
                if (indexExists) {
                    await queryInterface.removeIndex(tableName, indexName);
                    console.log(`Removed index ${indexName} from ${tableName}`);
                } else {
                    console.log(`Index ${indexName} does not exist on ${tableName}, skipping.`);
                }
            } catch (err) {
                // Ignore if table doesn't exist etc.
                console.log(`Could not check/remove index ${indexName} on ${tableName}: ${err.message}`);
            }
        };

        // Remove indexes in reverse order
        await safeRemoveIndex('user', 'idx_user_role');
        await safeRemoveIndex('user', 'idx_user_username');
        await safeRemoveIndex('student', 'idx_student_year_of_admission');
        await safeRemoveIndex('student', 'idx_student_semester_section');
        await safeRemoveIndex('mentoring_minute', 'idx_mentoring_minute_faculty_id');
        await safeRemoveIndex('mentoring_minute', 'idx_mentoring_minute_student_date');
        await safeRemoveIndex('faculty', 'idx_faculty_user_id');
        await safeRemoveIndex('student', 'idx_student_user_id');
        await safeRemoveIndex('student', 'idx_student_mentor_id');
    },
};
