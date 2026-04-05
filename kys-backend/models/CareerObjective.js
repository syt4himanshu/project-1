const { DataTypes, Model } = require('sequelize');

class CareerObjective extends Model {
  static initModel(sequelize) {
    CareerObjective.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        career_goal: { type: DataTypes.STRING(50), allowNull: false },
        specific_details: { type: DataTypes.TEXT, allowNull: true },
        clarity_preparedness: { type: DataTypes.STRING(20), allowNull: true },
        interested_in_campus_placement: { type: DataTypes.BOOLEAN, allowNull: true },
        campus_placement_reasons: { type: DataTypes.TEXT, allowNull: true },
      },
      { sequelize, modelName: 'CareerObjective', tableName: 'career_objective', timestamps: false },
    );
  }
}

module.exports = CareerObjective;
