'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('ProductImages', 'alt_text', {
      type: Sequelize.STRING,
      allowNull: true,
  });
    },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ProductImages', 'alt_text');
  }
};
