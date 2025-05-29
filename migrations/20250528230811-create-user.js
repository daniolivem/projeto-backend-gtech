'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', { // Nome da tabela vai ser 'Users'
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false // Campo obrigatório
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false // Também obrigatório
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // Tem que preencher
        unique: true      // Não pode repetir email
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false // Tem que ter senha (hash)
      },
      createdAt: { // Sequelize já gera isso se usar timestamps: true no model
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Garante que o valor vem do banco
      },
      updatedAt: { // Também gerado automático pelo Sequelize
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') // Atualiza sozinho no banco
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
