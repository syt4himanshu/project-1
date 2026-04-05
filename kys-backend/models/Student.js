const { DataTypes, Model } = require('sequelize');
const { buildFullName } = require('../utils/helpers');

class Student extends Model {
  static initModel(sequelize) {
    Student.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        uid: { type: DataTypes.STRING(20), unique: true, allowNull: false },
        first_name: { type: DataTypes.STRING(120), allowNull: true },
        middle_name: { type: DataTypes.STRING(120), allowNull: true },
        last_name: { type: DataTypes.STRING(120), allowNull: true },
        semester: { type: DataTypes.INTEGER, allowNull: true },
        section: { type: DataTypes.STRING(10), allowNull: true },
        year_of_admission: { type: DataTypes.INTEGER, allowNull: true },
        current_year: { type: DataTypes.INTEGER, allowNull: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        mentor_id: { type: DataTypes.INTEGER, allowNull: true },
      },
      {
        sequelize,
        modelName: 'Student',
        tableName: 'student',
        timestamps: false,
        getterMethods: {
          full_name() {
            return buildFullName(this.first_name, this.middle_name, this.last_name);
          },
        },
      },
    );
  }
}

module.exports = Student;
