'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ProductOptions', 'name');
  },
  async down (queryInterface, Sequelize) {
    // Adicione a coluna de volta se precisar reverter
    await queryInterface.addColumn('ProductOptions', 'name', {
      type: Sequelize.STRING,
      allowNull: false, // Ou como era originalmente
      // defaultValue: ''
    });
  }
};