const { DataTypes, Model } = require('sequelize');

class CareerDevActivity extends Model {
  static initModel(sequelize) {
    CareerDevActivity.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        activity: { type: DataTypes.STRING(100), allowNull: false },
        score: { type: DataTypes.STRING(50), allowNull: true },
        test_date: { type: DataTypes.DATEONLY, allowNull: true },
      },
      { sequelize, modelName: 'CareerDevActivity', tableName: 'career_dev_activity', timestamps: false },
    );
  }
}

module.exports = CareerDevActivity;
