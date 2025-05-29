// migrations/SEU_ARQUIVO_DE_MIGRACAO-create-product-option.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductOptions', { // Nome da tabela: ProductOptions
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products', // Tabela referenciada
          key: 'id'          // Coluna referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'  // Se o produto for deletado, suas opções também são
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false // Obrigatório
      },
      shape: {
        type: Sequelize.ENUM('square', 'circle'), // Define o tipo ENUM com os valores permitidos
        allowNull: false,
        defaultValue: 'square' // Padrão 'square'
      },
      radius: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 // Padrão 0
      },
      type: {
        type: Sequelize.ENUM('text', 'color'), // Define o tipo ENUM
        allowNull: false,
        defaultValue: 'text' // Padrão 'text'
      },
      values: { // Armazena valores separados por vírgula
        type: Sequelize.STRING, // Ou Sequelize.TEXT se a string for muito longa
        allowNull: false // Obrigatório
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
    await queryInterface.dropTable('ProductOptions');
  }
};