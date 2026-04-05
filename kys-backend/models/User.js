const { DataTypes, Model } = require('sequelize');

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        username: { type: DataTypes.STRING(120), unique: true, allowNull: false },
        email: { type: DataTypes.STRING(120), allowNull: true },
        password_hash: { type: DataTypes.STRING(255), allowNull: false },
        role: { type: DataTypes.STRING(20), allowNull: false },
      },
      { sequelize, modelName: 'User', tableName: 'user', timestamps: false },
    );
  }
}

module.exports = User;
