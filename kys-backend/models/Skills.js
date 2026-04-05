const { DataTypes, Model } = require('sequelize');

class Skills extends Model {
  static initModel(sequelize) {
    Skills.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        programming_languages: { type: DataTypes.TEXT, allowNull: true },
        technologies_frameworks: { type: DataTypes.TEXT, allowNull: true },
        domains_of_interest: { type: DataTypes.TEXT, allowNull: true },
        familiar_tools_platforms: { type: DataTypes.TEXT, allowNull: true },
      },
      { sequelize, modelName: 'Skills', tableName: 'skills', timestamps: false },
    );
  }
}

module.exports = Skills;
