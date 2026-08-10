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
        // These three existed in the DB since migration 20260412000100 but were
        // never added to this model — the app could not read/write them until now.
        non_technical_areas: { type: DataTypes.STRING(255), allowNull: true },
        student_mentor_interest: { type: DataTypes.STRING(20), allowNull: true },
        expectations_from_institute: { type: DataTypes.TEXT, allowNull: true },
        mentorship_domain: { type: DataTypes.STRING(100), allowNull: true },
        // New fields to match production
        placement_type: { type: DataTypes.STRING(50), allowNull: true },
        higher_studies_type: { type: DataTypes.STRING(50), allowNull: true },
        higher_studies_location: { type: DataTypes.STRING(20), allowNull: true },
      },
      { sequelize, modelName: 'CareerObjective', tableName: 'career_objective', timestamps: false },
    );
  }
}

module.exports = CareerObjective;