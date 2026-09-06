const { DataTypes, Model } = require('sequelize');

class IdempotencyKey extends Model {
  static initModel(sequelize) {
    IdempotencyKey.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        key: { type: DataTypes.STRING(64), allowNull: false, unique: true },
        faculty_id: { type: DataTypes.INTEGER, allowNull: false },
        operation_type: { type: DataTypes.STRING(64), allowNull: false },
        request_hash: { type: DataTypes.STRING(64), allowNull: false },
        status: {
          type: DataTypes.ENUM('processing', 'completed', 'failed'),
          allowNull: false,
          defaultValue: 'processing',
        },
        response_status: { type: DataTypes.INTEGER, allowNull: true },
        response_body: { type: DataTypes.TEXT, allowNull: true },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        completed_at: { type: DataTypes.DATE, allowNull: true },
      },
      {
        sequelize,
        modelName: 'IdempotencyKey',
        tableName: 'idempotency_keys',
        timestamps: false,
      },
    );
  }
}

module.exports = IdempotencyKey;
