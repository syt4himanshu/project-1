'use strict';

/**
 * Fix: faculty.user_id FK had no ON DELETE action (defaults to RESTRICT),
 * causing a DB error when deleting a user who has a faculty profile.
 * Change to ON DELETE CASCADE so deleting the user row also removes the faculty row.
 */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Drop the old constraint
        await queryInterface.sequelize.query(`
      ALTER TABLE public.faculty
      DROP CONSTRAINT IF EXISTS faculty_user_id_fkey;
    `);

        // Re-add with CASCADE
        await queryInterface.sequelize.query(`
      ALTER TABLE public.faculty
      ADD CONSTRAINT faculty_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES public."user"(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE;
    `);
    },

    async down(queryInterface, Sequelize) {
        // Revert to no-action (original behaviour)
        await queryInterface.sequelize.query(`
      ALTER TABLE public.faculty
      DROP CONSTRAINT IF EXISTS faculty_user_id_fkey;
    `);

        await queryInterface.sequelize.query(`
      ALTER TABLE public.faculty
      ADD CONSTRAINT faculty_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES public."user"(id);
    `);
    },
};
