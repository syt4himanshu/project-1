const { DataTypes, Model } = require('sequelize');

class Project extends Model {
  static initModel(sequelize) {
    Project.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: { type: DataTypes.INTEGER, allowNull: false },
        title: { type: DataTypes.TEXT, allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        project_guide: { type: DataTypes.STRING(255), allowNull: true },
        domain: { type: DataTypes.STRING(255), allowNull: true },
      },
      { sequelize, modelName: 'Project', tableName: 'project', timestamps: false },
    );
  }
}

module.exports = Project;