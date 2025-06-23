// Carrega as variáveis de ambiente do .env (tipo, pega as configs secretas)
require('dotenv').config();

// Importa o express pra criar o servidor (basicamente o coração da API)
const express = require('express');
const app = express();

// Importa as rotas de usuário (onde ficam as paradas de login, cadastro, etc)
const userRoutes = require('./routes/userRoutes');

// Importa as rotas de categorias
const categoryRoutes = require('./routes/categoryRoutes');

// Middleware pra aceitar JSON nas requisições (senão não rola pegar os dados direito)
app.use(express.json());

// Rotas (aqui diz pra onde cada requisição vai)
app.use('/v1/user', userRoutes);
app.use('/v1/category', categoryRoutes);

// Rota principal só pra testar se tá tudo ok (tipo um "oi, tô funcionando")
app.get('/', (req, res) => {
    res.status(200).send('API Backend está no ar e funcionando!');
});


// Exporta o app pra usar em outros arquivos (tipo no server.js que vai rodar de verdade)
module.exports = app;
