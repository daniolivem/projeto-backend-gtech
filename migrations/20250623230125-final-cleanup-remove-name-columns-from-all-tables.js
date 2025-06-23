'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Tenta remover a coluna 'name' de ProductImages se ela existir
    try {
      await queryInterface.removeColumn('ProductImages', 'name');
    } catch (e) {
      console.log("Coluna 'name' em ProductImages não encontrada (já removida ou nunca existiu aqui).");
    }

    // Tenta remover a coluna 'name' de ProductOptions se ela existir
    try {
      await queryInterface.removeColumn('ProductOptions', 'name');
    } catch (e) {
      console.log("Coluna 'name' em ProductOptions não encontrada (já removida ou nunca existiu aqui).");
    }
  },

  async down (queryInterface, Sequelize) {
    // A função 'down' pode ser vazia ou adicionar as colunas de volta para rollback completo,
    // mas para esta migração de limpeza, pode não ser estritamente necessário se as colunas não são desejadas.
    console.log("Reversão de limpeza de coluna 'name' pode precisar de adição manual se as colunas forem necessárias.");
  }
};