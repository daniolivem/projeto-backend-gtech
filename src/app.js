// Importa o express pra criar o servidor
const express = require('express');
// Carrega as variáveis de ambiente do .env
require('dotenv').config();

const app = express();

// Permite receber JSON nas requisições
app.use(express.json());

// Rota principal só pra testar se a API tá funcionando
app.get('/', (req, res) => {
    res.status(200).send('API Backend está no ar e funcionando!');
});

// Exporta o app pra usar em outros arquivos (tipo o server.js)
module.exports = app;