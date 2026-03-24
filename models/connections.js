'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Connections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Connections.belongsTo(models.User, { foreignKey: 'requester_id', onDelete: 'CASCADE' });
      Connections.belongsTo(models.User, { foreignKey: 'requestee_id', onDelete: 'CASCADE' });
    }
  }
  Connections.init({
    requester_id: DataTypes.INTEGER,
    requestee_id: DataTypes.INTEGER,
    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Connections',
  });
  return Connections;
};