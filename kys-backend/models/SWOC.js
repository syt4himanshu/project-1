const { DataTypes, Model } = require('sequelize');

class SWOC extends Model {
  static initModel(sequelize) {
    SWOC.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        strengths: { type: DataTypes.TEXT, allowNull: true },
        weaknesses: { type: DataTypes.TEXT, allowNull: true },
        opportunities: { type: DataTypes.TEXT, allowNull: true },
        challenges: { type: DataTypes.TEXT, allowNull: true },
      },
      { sequelize, modelName: 'SWOC', tableName: 'swoc', timestamps: false },
    );
  }
}

module.exports = SWOC;
