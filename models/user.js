'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Role, {
        foreignKey: 'user_id',
        as: 'role',
      });
    }
  }
  User.init(
    {
      role_id: DataTypes.INTEGER,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.prototype.comparePassword = function (passw, cd) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
        return cd(err);
      }
      cd(null, isMatch);
    });
  };

  return User;
};
