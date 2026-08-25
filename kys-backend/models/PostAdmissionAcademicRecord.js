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
        season: { type: DataTypes.STRING(20), allowNull: true },
        year_of_passing: { type: DataTypes.INTEGER, allowNull: true },
        college_rank: { type: DataTypes.STRING(100), allowNull: true },
        academic_awards: { type: DataTypes.STRING(255), allowNull: true },
        backlog_count: { type: DataTypes.INTEGER, allowNull: true },
        mse_marks: { type: DataTypes.FLOAT, allowNull: true },
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