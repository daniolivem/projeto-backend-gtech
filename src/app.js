// src/app.js
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors'); // <-- Adicione cors

// Middlewares
app.use(express.json()); // Middleware para aceitar JSON no corpo da requisição
app.use(cors()); // <-- Habilita CORS para todas as origens (ajuste em produção para domínios específicos)

// Importação das rotas
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes'); // <-- DESCOMENTADO!

// Rota de teste simples para verificar se a API está online
app.get('/', (req, res) => {
    res.status(200).send('API Backend GTONLINE2 está no ar e funcionando!');
});

// Aplicação das rotas com seus respectivos prefixos
app.use('/v1/user', userRoutes);
app.use('/v1/category', categoryRoutes);
app.use('/v1/product', productRoutes); // <-- DESCOMENTADO!

// Middleware de tratamento de erros (opcional, mas recomendado para capturar erros não tratados)
app.use((err, req, res, next) => {
    console.error(err.stack); // Loga o stack trace do erro no console do servidor
    res.status(500).json({ message: "Algo deu errado no servidor!" });
});


module.exports = app;