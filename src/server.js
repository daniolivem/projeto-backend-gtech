const app = require('./app.js');

const PORT = process.env.APP_PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Para acessar a rota de teste, abra: http://localhost:${PORT}/`);
});
