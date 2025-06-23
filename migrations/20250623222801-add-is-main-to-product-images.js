'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ProductImages', 'is_main', {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Define um valor padrão para a coluna
      allowNull: false, // Garante que a coluna não possa ser nula
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ProductImages', 'is_main');
  }
};
