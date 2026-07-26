const { DataTypes, Model } = require('sequelize');

class PastEducation extends Model {
  static initModel(sequelize) {
    PastEducation.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        exam_name: { type: DataTypes.STRING(100), allowNull: false },
        percentage: { type: DataTypes.FLOAT, allowNull: true },
        year_of_passing: { type: DataTypes.INTEGER, allowNull: true },
        exam_score: { type: DataTypes.FLOAT, allowNull: true },
        exam_date: { type: DataTypes.DATEONLY, allowNull: true },
        board: { type: DataTypes.STRING(100), allowNull: true },
        exam_type: { type: DataTypes.STRING(100), allowNull: true },
      },
      { sequelize, modelName: 'PastEducation', tableName: 'past_education', timestamps: false },
    );
  }
}

module.exports = PastEducation;