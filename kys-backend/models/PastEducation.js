const { DataTypes, Model } = require('sequelize');

class PastEducation extends Model {
  static initModel(sequelize) {
    PastEducation.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        exam_name: { type: DataTypes.STRING(100), allowNull: false },
        percentage: { type: DataTypes.FLOAT, allowNull: false },
        year_of_passing: { type: DataTypes.INTEGER, allowNull: false },
      },
      { sequelize, modelName: 'PastEducation', tableName: 'past_education', timestamps: false },
    );
  }
}

module.exports = PastEducation;
