'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Use changeColumn para MODIFICAR a coluna 'name' que já existe
    await queryInterface.changeColumn('ProductOptions', 'name', {
      type: Sequelize.STRING, // Mantenha o tipo de dado original (assumo STRING)
      allowNull: true,       // Permite que o campo seja nulo (solução para "doesn't have a default value")
      // defaultValue: null // Opcional: define um valor padrão nulo se preferir
    });
    // IMPORTANTE: Se o seu modelo ProductOption.js NÃO USA 'name',
    // e sim 'title', 'shape', etc., essa coluna 'name' no DB
    // pode ser um resquício e você pode querer removê-la completamente depois.
    // Mas para o erro atual, permitir null é o mais direto.
  },

  async down (queryInterface, Sequelize) {
    // Lógica para reverter a mudança, se necessário
    await queryInterface.changeColumn('ProductOptions', 'name', {
      type: Sequelize.STRING,
      allowNull: false, // Reverte para não nulo
      defaultValue: undefined // Remove o default
    });
  }
};