const { DataTypes, Model } = require('sequelize');

class CoCurricularOrganization extends Model {
  static initModel(sequelize) {
    CoCurricularOrganization.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING(255), allowNull: true },
        date: { type: DataTypes.DATEONLY, allowNull: true },
        level: { type: DataTypes.STRING(100), allowNull: true },
        remark: { type: DataTypes.STRING(255), allowNull: true },
      },
      {
        sequelize,
        modelName: 'CoCurricularOrganization',
        tableName: 'co_curricular_organization',
        timestamps: false,
      },
    );
  }
}

module.exports = CoCurricularOrganization;
