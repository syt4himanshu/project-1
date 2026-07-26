const { DataTypes, Model } = require('sequelize');

class PasswordResetToken extends Model {
  static initModel(sequelize) {
    PasswordResetToken.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        token: { type: DataTypes.STRING(255), allowNull: false },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        expires_at: { type: DataTypes.DATE, allowNull: false },
        used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      },
      {
        sequelize,
        modelName: 'PasswordResetToken',
        tableName: 'password_reset_token',
        timestamps: false,
      },
    );
  }
}

module.exports = PasswordResetToken;
