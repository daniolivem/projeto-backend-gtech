// migrations/SEU_ARQUIVO_DE_MIGRACAO-create-product.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', { // Nome da tabela: Products
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false // Padrão 0 (false)
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false // Obrigatório
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false, // Obrigatório
        unique: true      // Slugs de produtos geralmente são únicos
      },
      use_in_menu: { // Este campo parece um pouco incomum para produtos, mas seguindo o escopo
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false // Padrão 0 (false)
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 // Padrão 0
      },
      description: {
        type: Sequelize.TEXT, // Usar TEXT para descrições mais longas é uma boa prática
        allowNull: true      // Opcional
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false // Obrigatório
      },
      price_with_discount: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('Products');
  }
};