const { DataTypes, Model } = require('sequelize');

class Faculty extends Model {
  static initModel(sequelize) {
    Faculty.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: DataTypes.STRING(120), unique: true, allowNull: false },
        first_name: { type: DataTypes.STRING(120), allowNull: true },
        last_name: { type: DataTypes.STRING(120), allowNull: true },
        contact_number: { type: DataTypes.STRING(20), allowNull: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      },
      { sequelize, modelName: 'Faculty', tableName: 'faculty', timestamps: false },
    );
  }
}

module.exports = Faculty;
