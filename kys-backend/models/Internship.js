const { DataTypes, Model } = require('sequelize');

class Internship extends Model {
  static initModel(sequelize) {
    Internship.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        company_name: { type: DataTypes.STRING(255), allowNull: true },
        title: { type: DataTypes.STRING(255), allowNull: true },
        city: { type: DataTypes.STRING(120), allowNull: true },
        state: { type: DataTypes.STRING(120), allowNull: true },
        domain: { type: DataTypes.STRING(255), allowNull: true },
        internship_type: { type: DataTypes.STRING(20), allowNull: true },
        paid_unpaid: { type: DataTypes.STRING(10), allowNull: true },
        paid_type: { type: DataTypes.STRING(50), allowNull: true },
        stipend_amount: { type: DataTypes.STRING(50), allowNull: true },
        paid_amount: { type: DataTypes.STRING(50), allowNull: true },
        start_date: { type: DataTypes.DATEONLY, allowNull: true },
        end_date: { type: DataTypes.DATEONLY, allowNull: true },
        designation: { type: DataTypes.STRING(120), allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
      },
      { sequelize, modelName: 'Internship', tableName: 'internship', timestamps: false },
    );
  }
}

module.exports = Internship;