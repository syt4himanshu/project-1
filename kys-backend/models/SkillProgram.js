const { DataTypes, Model } = require('sequelize');

class SkillProgram extends Model {
  static initModel(sequelize) {
    SkillProgram.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        course_title: { type: DataTypes.STRING(255), allowNull: true },
        platform: { type: DataTypes.STRING(255), allowNull: true },
        duration_hours: { type: DataTypes.FLOAT, allowNull: true },
        date_from: { type: DataTypes.DATEONLY, allowNull: true },
        date_to: { type: DataTypes.DATEONLY, allowNull: true },
      },
      {
        sequelize,
        modelName: 'SkillProgram',
        tableName: 'skill_program',
        timestamps: false,
      },
    );
  }
}

module.exports = SkillProgram;
