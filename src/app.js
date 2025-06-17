require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json()); // Middleware para aceitar JSON

const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.get('/', (req, res) => {
    res.status(200).send('API Backend está no ar e funcionando!');
});

app.use('/v1/user', userRoutes);
// app.use('/v1/product', productRoutes);
app.use('/v1/category', categoryRoutes);



module.exports = app;