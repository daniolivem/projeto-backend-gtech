// migrations/SEU_ARQUIVO_DE_MIGRACAO-create-category.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', { // Nome da tabela: Categories
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false // Obrigatório
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false, // Obrigatório
        unique: true      // Slugs geralmente devem ser únicos
      },
      use_in_menu: {
        type: Sequelize.BOOLEAN,
        allowNull: false, // Para garantir que tenha um valor
        defaultValue: false // Valor padrão 0 (false)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categories');
  }
};