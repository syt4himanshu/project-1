'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      username: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.STRING(20), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('Faculty', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      email: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      first_name: { type: Sequelize.STRING(120), allowNull: true },
      last_name: { type: Sequelize.STRING(120), allowNull: true },
      contact_number: { type: Sequelize.STRING(20), allowNull: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('Student', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      uid: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      first_name: { type: Sequelize.STRING(120), allowNull: true },
      middle_name: { type: Sequelize.STRING(120), allowNull: true },
      last_name: { type: Sequelize.STRING(120), allowNull: true },
      semester: { type: Sequelize.INTEGER, allowNull: true },
      section: { type: Sequelize.STRING(10), allowNull: true },
      year_of_admission: { type: Sequelize.INTEGER, allowNull: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      mentor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Faculty', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('StudentPersonalInfo', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Student', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      mobile_no: { type: Sequelize.STRING(20), allowNull: false },
      personal_email: { type: Sequelize.STRING(255), allowNull: false },
      college_email: { type: Sequelize.STRING(255), allowNull: false },
      linked_in_id: { type: Sequelize.STRING(255), allowNull: false },
      permanent_address: { type: Sequelize.TEXT, allowNull: false },
      dob: { type: Sequelize.DATEONLY, allowNull: false },
      gender: { type: Sequelize.STRING(10), allowNull: false },
      father_name: { type: Sequelize.STRING(120), allowNull: false },
      father_mobile_no: { type: Sequelize.STRING(20), allowNull: false },
      father_email: { type: Sequelize.STRING(255), allowNull: true },
      father_occupation: { type: Sequelize.STRING(255), allowNull: false },
      mother_name: { type: Sequelize.STRING(120), allowNull: false },
      mother_mobile_no: { type: Sequelize.STRING(20), allowNull: false },
      mother_email: { type: Sequelize.STRING(255), allowNull: true },
      mother_occupation: { type: Sequelize.STRING(255), allowNull: false },
      emergency_contact_name: { type: Sequelize.STRING(120), allowNull: false },
      emergency_contact_number: { type: Sequelize.STRING(20), allowNull: false },
      blood_group: { type: Sequelize.STRING(5), allowNull: true },
      category: { type: Sequelize.STRING(20), allowNull: true },
      aadhar_number: { type: Sequelize.STRING(14), allowNull: true },
      mis_uid: { type: Sequelize.STRING(50), allowNull: true },
      github_id: { type: Sequelize.STRING(255), allowNull: true },
      present_address: { type: Sequelize.TEXT, allowNull: true },
      guardian_name: { type: Sequelize.STRING(120), allowNull: true },
      guardian_mobile: { type: Sequelize.STRING(15), allowNull: true },
      guardian_email: { type: Sequelize.STRING(255), allowNull: true },
      photo_url: { type: Sequelize.TEXT, allowNull: true },
      photo_public_id: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    const createChild = (name, fields, uniqueStudent = false) =>
      queryInterface.createTable(name, {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: uniqueStudent,
          references: { model: 'Student', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        ...fields,
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      });

    await createChild('PastEducation', {
      exam_name: { type: Sequelize.STRING(100), allowNull: false },
      percentage: { type: Sequelize.FLOAT, allowNull: false },
      year_of_passing: { type: Sequelize.INTEGER, allowNull: false },
    });

    await createChild('PostAdmissionAcademicRecord', {
      semester: { type: Sequelize.INTEGER, allowNull: false },
      sgpa: { type: Sequelize.FLOAT, allowNull: false },
      backlog_subjects: { type: Sequelize.TEXT, allowNull: true },
    });

    await createChild('Project', {
      title: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.STRING(255), allowNull: true },
    });

    await createChild('Internship', {
      company_name: { type: Sequelize.STRING(255), allowNull: true },
      domain: { type: Sequelize.STRING(255), allowNull: true },
      internship_type: { type: Sequelize.STRING(20), allowNull: true },
      paid_unpaid: { type: Sequelize.STRING(10), allowNull: true },
      start_date: { type: Sequelize.DATEONLY, allowNull: true },
      end_date: { type: Sequelize.DATEONLY, allowNull: true },
    });

    await createChild('CoCurricularParticipation', {
      name: { type: Sequelize.STRING(255), allowNull: true },
      date: { type: Sequelize.DATEONLY, allowNull: true },
      level: { type: Sequelize.STRING(100), allowNull: true },
      awards: { type: Sequelize.STRING(255), allowNull: true },
    });

    await createChild('CoCurricularOrganization', {
      name: { type: Sequelize.STRING(255), allowNull: true },
      date: { type: Sequelize.DATEONLY, allowNull: true },
      level: { type: Sequelize.STRING(100), allowNull: true },
      remark: { type: Sequelize.STRING(255), allowNull: true },
    });

    await createChild(
      'CareerObjective',
      {
        career_goal: { type: Sequelize.STRING(50), allowNull: false },
        specific_details: { type: Sequelize.TEXT, allowNull: true },
        clarity_preparedness: { type: Sequelize.STRING(20), allowNull: true },
        interested_in_campus_placement: { type: Sequelize.BOOLEAN, allowNull: true },
        campus_placement_reasons: { type: Sequelize.TEXT, allowNull: true },
      },
      true,
    );

    await createChild(
      'Skills',
      {
        programming_languages: { type: Sequelize.TEXT, allowNull: true },
        technologies_frameworks: { type: Sequelize.TEXT, allowNull: true },
        domains_of_interest: { type: Sequelize.TEXT, allowNull: true },
        familiar_tools_platforms: { type: Sequelize.TEXT, allowNull: true },
      },
      true,
    );

    await createChild(
      'SWOC',
      {
        strengths: { type: Sequelize.TEXT, allowNull: true },
        weaknesses: { type: Sequelize.TEXT, allowNull: true },
        opportunities: { type: Sequelize.TEXT, allowNull: true },
        challenges: { type: Sequelize.TEXT, allowNull: true },
      },
      true,
    );

    await queryInterface.createTable('MentoringMinute', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Student', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      faculty_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Faculty', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      semester: { type: Sequelize.INTEGER, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: true },
      remarks: { type: Sequelize.TEXT, allowNull: true },
      suggestion: { type: Sequelize.TEXT, allowNull: true },
      action: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('MentoringMinute');
    await queryInterface.dropTable('SWOC');
    await queryInterface.dropTable('Skills');
    await queryInterface.dropTable('CareerObjective');
    await queryInterface.dropTable('CoCurricularOrganization');
    await queryInterface.dropTable('CoCurricularParticipation');
    await queryInterface.dropTable('Internship');
    await queryInterface.dropTable('Project');
    await queryInterface.dropTable('PostAdmissionAcademicRecord');
    await queryInterface.dropTable('PastEducation');
    await queryInterface.dropTable('StudentPersonalInfo');
    await queryInterface.dropTable('Student');
    await queryInterface.dropTable('Faculty');
    await queryInterface.dropTable('User');
  },
};
