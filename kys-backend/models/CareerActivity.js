const { DataTypes, Model } = require('sequelize');

class CareerActivity extends Model {
  static initModel(sequelize) {
    CareerActivity.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        activity_name: { type: DataTypes.STRING(255), allowNull: false },
        score_rank: { type: DataTypes.STRING(50), allowNull: false },
        exam_date: { type: DataTypes.DATEONLY, allowNull: true },
      },
      { sequelize, modelName: 'CareerActivity', tableName: 'career_activity', timestamps: false },
    );
  }
}

module.exports = CareerActivity;
