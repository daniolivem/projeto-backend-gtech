// migrations/SEU_ARQUIVO_DE_MIGRACAO-create-product-image.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductImages', { // Nome da tabela: ProductImages
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // Define a chave estrangeira
          model: 'Products',  // Nome da tabela referenciada (Products)
          key: 'id'           // Coluna referenciada na tabela Products (id)
        },
        onUpdate: 'CASCADE',  // Se o id do produto mudar, atualiza aqui também
        onDelete: 'CASCADE'   // Se o produto for deletado, as imagens associadas também são
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false // Padrão 0 (false)
      },
      path: {
        type: Sequelize.STRING, // Ou Sequelize.TEXT se os caminhos puderem ser muito longos
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
    await queryInterface.dropTable('ProductImages');
  }
};