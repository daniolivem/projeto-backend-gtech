// Carrega as variáveis de ambiente do .env (tipo, pega as configs secretas)
require('dotenv').config();

// Importa o express pra criar o servidor (basicamente o coração da API)
const express = require('express'); // Importa o express, que é o framework que vamos usar pra criar a API (vem sempre antes de tudo)
const app = express();

// Middleware pra aceitar JSON nas requisições (senão não rola pegar os dados direito)
app.use(express.json());

// Importa as rotas (onde ficam os dados de login, cadastro, produtos, categorias, etc)
const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');

// Rota principal só pra testar se tá tudo ok (tipo um "oi, tô funcionando")
app.get('/', (req, res) => {
    res.status(200).send('API Backend está no ar e funcionando!');
});

// --- Configuração das Rotas ---
// Aqui a gente diz pra API qual caminho (endpoint) usa qual conjunto de rotas.
// Por exemplo, tudo que começar com /v1/user vai ser gerenciado pelo userRoutes.

app.use('/v1/user', userRoutes);
// app.use('/v1/product', productRoutes);
app.use('/v1/category', categoryRoutes);



// Exporta o app pra usar em outros arquivos (tipo no server.js que vai rodar de verdade)
module.exports = app;