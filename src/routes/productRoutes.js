const express = require('express');
const router = express.Router();

let products = [
    {id: 1, name: 'Tênis Nike V8', price: 200.00},
    {id: 2, name: 'Calça Jeans', price: 89.90},
];

router.get('/', (req, res) => {
    res.send('Rota de produtos funcionando!');
});

router.get('/products', (req, res) => {
    res.json(products);
});

router.get('/:id', (req, res) => {
   const product = products.find(p => p.id === parseInt(req.params.id));
   if (!product) return res.status(404).json({message: 'Produto não encontrado'});
   res.json(product);
});

router.post('/', (req, res) => {
   const { name, price } = req.body;
   if (!name || !price) {
       return res.status(400).json({message: 'Nome e preço são obrigatórios'});
   }
   const newProduct = {
       id: products.length + 1,
       name,
       price
   };
   products.push(newProduct);
   res.status(201).json(newProduct);
});

router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price } = req.body;

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({message: 'Forneça pelo menos um nome ou preço para atualizar'});
    }
    if (name) {
        products[productIndex].name = name;
    }

    if (price) {
        products[productIndex].price = price;
    }

    res.json(products[productIndex]);
})

router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({message: 'Produto não encontrado para exclusão'})
    }

    const deletedProduct = products.splice(productIndex, 1);

    res.json({message: 'Produto excluído com sucesso', product: deletedProduct[0]})
})
module.exports = router;