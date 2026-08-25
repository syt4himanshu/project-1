const { DataTypes, Model } = require('sequelize');

class SupportPlan extends Model {
  static initModel(sequelize) {
    SupportPlan.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        studentId: { type: DataTypes.INTEGER, allowNull: false, field: 'student_id' },
        type: { type: DataTypes.ENUM('slow', 'advanced'), allowNull: false },
        mechanism: { type: DataTypes.STRING, allowNull: false },
        scheduledAt: { type: DataTypes.DATE, allowNull: false, field: 'scheduled_at' },
        status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled'), defaultValue: 'pending' },
        notes: { type: DataTypes.TEXT },
        createdBy: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by' },
      },
      { sequelize, modelName: 'SupportPlan', tableName: 'support_plans', timestamps: true, underscored: true }
    );
  }
}

module.exports = SupportPlan;
