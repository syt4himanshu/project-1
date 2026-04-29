const { DataTypes, Model } = require('sequelize');

class MentoringMinute extends Model {
  static initModel(sequelize) {
    MentoringMinute.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        faculty_id: { type: DataTypes.INTEGER, allowNull: true },
        faculty_name_snapshot: { type: DataTypes.STRING(255), allowNull: true },
        faculty_email_snapshot: { type: DataTypes.STRING(255), allowNull: true },
        semester: { type: DataTypes.INTEGER, allowNull: false },
        date: { type: DataTypes.DATEONLY, allowNull: true },
        remarks: { type: DataTypes.TEXT, allowNull: true },
        suggestion: { type: DataTypes.TEXT, allowNull: true },
        action: { type: DataTypes.TEXT, allowNull: true },
      },
      { sequelize, modelName: 'MentoringMinute', tableName: 'mentoring_minute', timestamps: false },
    );
  }
}

module.exports = MentoringMinute;
