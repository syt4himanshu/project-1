const { DataTypes, Model } = require('sequelize');

class PostAdmissionAcademicRecord extends Model {
  static initModel(sequelize) {
    PostAdmissionAcademicRecord.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        semester: { type: DataTypes.INTEGER, allowNull: false },
        sgpa: { type: DataTypes.FLOAT, allowNull: false },
        backlog_subjects: { type: DataTypes.TEXT, allowNull: true },
      },
      {
        sequelize,
        modelName: 'PostAdmissionAcademicRecord',
        tableName: 'post_admission_academic_record',
        timestamps: false,
      },
    );
  }
}

module.exports = PostAdmissionAcademicRecord;
