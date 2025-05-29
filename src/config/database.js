
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  test: { // Configuração para ambiente de teste (usar com Jest depois)
    username: process.env.DB_USER_TEST || process.env.DB_USER,
    password: process.env.DB_PASS_TEST || process.env.DB_PASS,
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`, // Ex: seu_banco_test
    host: process.env.DB_HOST_TEST || process.env.DB_HOST,
    dialect: process.env.DB_DIALECT_TEST || process.env.DB_DIALECT,
    logging: false, // Desabilita logs do Sequelize para testes
  },
  production: {
    username: process.env.DB_USER_PROD || process.env.DB_USER, // Use variáveis de ambiente específicas para produção
    password: process.env.DB_PASS_PROD || process.env.DB_PASS,
    database: process.env.DB_NAME_PROD || process.env.DB_NAME,
    host: process.env.DB_HOST_PROD || process.env.DB_HOST,
    dialect: process.env.DB_DIALECT_PROD || process.env.DB_DIALECT,
    logging: false, // Geralmente se desabilita logs SQL diretos em produção
    // Configurações de Pool para produção (melhora performance e resiliência)
    // pool: {
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000
    // }
  }
};