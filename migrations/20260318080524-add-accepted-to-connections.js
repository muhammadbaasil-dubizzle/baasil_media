'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Connections', 'accepted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Connections', 'accepted');
  }
};
