'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.User, {
        foreignKey: 'group_id',
        as: 'users',
      });
    }
  }
  Group.init(
    {
      group_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      group_description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Group',
    }
  );
  return Group;
};
