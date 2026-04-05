const { DataTypes, Model } = require('sequelize');

class CoCurricularParticipation extends Model {
  static initModel(sequelize) {
    CoCurricularParticipation.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING(255), allowNull: true },
        date: { type: DataTypes.DATEONLY, allowNull: true },
        level: { type: DataTypes.STRING(100), allowNull: true },
        awards: { type: DataTypes.STRING(255), allowNull: true },
      },
      {
        sequelize,
        modelName: 'CoCurricularParticipation',
        tableName: 'co_curricular_participation',
        timestamps: false,
      },
    );
  }
}

module.exports = CoCurricularParticipation;
