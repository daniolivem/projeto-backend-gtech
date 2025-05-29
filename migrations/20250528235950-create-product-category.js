// migrations/SEU_ARQUIVO_DE_MIGRACAO-create-product-category.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductCategories', { // Nome da tabela
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, // Parte da chave primária composta
        references: {
          model: 'Products', // Tabela referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Se o produto for deletado, as associações são removidas
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true, // Parte da chave primária composta
        references: {
          model: 'Categories', // Tabela referenciada
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Se a categoria for deletada, as associações são removidas
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
    await queryInterface.dropTable('ProductCategories');
  }
};