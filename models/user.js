'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Comments, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Likes, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Connections, { foreignKey: 'requester_id', onDelete: 'CASCADE' });
      User.hasMany(models.Connections, { foreignKey: 'requestee_id', onDelete: 'CASCADE' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    numConnections: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    numPosts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};