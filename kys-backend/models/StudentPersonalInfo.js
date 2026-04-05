const { DataTypes, Model } = require('sequelize');

class StudentPersonalInfo extends Model {
  static initModel(sequelize) {
    StudentPersonalInfo.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        mobile_no: { type: DataTypes.STRING(20), allowNull: false },
        personal_email: { type: DataTypes.STRING(255), allowNull: false },
        college_email: { type: DataTypes.STRING(255), allowNull: false },
        linked_in_id: { type: DataTypes.STRING(255), allowNull: false },
        permanent_address: { type: DataTypes.TEXT, allowNull: false },
        dob: { type: DataTypes.DATEONLY, allowNull: false },
        gender: { type: DataTypes.STRING(10), allowNull: false },
        father_name: { type: DataTypes.STRING(120), allowNull: false },
        father_mobile_no: { type: DataTypes.STRING(20), allowNull: false },
        father_email: { type: DataTypes.STRING(255), allowNull: true },
        father_occupation: { type: DataTypes.STRING(255), allowNull: false },
        mother_name: { type: DataTypes.STRING(120), allowNull: false },
        mother_mobile_no: { type: DataTypes.STRING(20), allowNull: false },
        mother_email: { type: DataTypes.STRING(255), allowNull: true },
        mother_occupation: { type: DataTypes.STRING(255), allowNull: false },
        emergency_contact_name: { type: DataTypes.STRING(120), allowNull: false },
        emergency_contact_number: { type: DataTypes.STRING(20), allowNull: false },
        blood_group: { type: DataTypes.STRING(5), allowNull: true },
        category: { type: DataTypes.STRING(20), allowNull: true },
        aadhar_number: { type: DataTypes.STRING(14), allowNull: true },
        mis_uid: { type: DataTypes.STRING(50), allowNull: true },
        github_id: { type: DataTypes.STRING(255), allowNull: true },
        present_address: { type: DataTypes.TEXT, allowNull: true },
        guardian_name: { type: DataTypes.STRING(120), allowNull: true },
        guardian_mobile: { type: DataTypes.STRING(15), allowNull: true },
        guardian_email: { type: DataTypes.STRING(255), allowNull: true },
        photo_url: { type: DataTypes.TEXT, allowNull: true },
        photo_public_id: { type: DataTypes.STRING(255), allowNull: true },
      },
      { sequelize, modelName: 'StudentPersonalInfo', tableName: 'student_personal_info', timestamps: false },
    );
  }
}

module.exports = StudentPersonalInfo;
