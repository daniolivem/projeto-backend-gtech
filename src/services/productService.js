// src/services/productService.js
const { Product, Category, ProductImage, ProductOption, ProductCategory } = require('../models'); // <-- CORRIGIDO: Nomes dos modelos
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Função para salvar imagem base64
// **ATENÇÃO**: Certifique-se de que a pasta 'uploads' exista na raiz do seu projeto ou crie-a dinamicamente.
function saveBase64Image(base64, folder = 'uploads') {
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Formato de imagem inválido');

    const ext = matches[1].split('/')[1];
    const data = matches[2];
    const filename = `${Date.now()}.${ext}`;

    // Caminho absoluto para a pasta 'uploads' na raiz do projeto
    const uploadDir = path.join(__dirname, '..', '..', folder); // <-- Ajustado para subir 2 níveis até a raiz do projeto

    // Cria a pasta 'uploads' se ela não existir
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
    return filename; // Retorna apenas o nome do arquivo, a URL completa será construída no frontend ou via um rota de arquivos estáticos no backend
}


module.exports = {
    async search({ limit = 10, page = 1, fields, match, category_ids, priceRange, options }) {
        const where = {};
        const include = [
            { model: ProductImage, as: 'images', attributes: ['path'] }, // <-- CORRIGIDO: ProductImage e atributo 'path'
            { model: ProductOption, as: 'options' }, // <-- CORRIGIDO: ProductOption
        ];

        // Filtro por campo específico
        if (match && fields) {
            where[fields] = { [Op.like]: `%${match}%` };
        }

        // Filtro por categorias
        if (category_ids) {
            include.push({
                model: Category,
                as: 'categories',
                where: { id: { [Op.in]: category_ids.split(',') } },
                through: { model: ProductCategory, attributes: [] }, // <-- CORRIGIDO: model: ProductCategory
            });
        } else {
            include.push({ model: Category, as: 'categories', through: { model: ProductCategory, attributes: [] } }); // <-- CORRIGIDO: model: ProductCategory
        }

        // Filtro por faixa de preço
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(parseFloat);
            where.price = { [Op.between]: [min, max] };
        }

        // Filtro por opções dinâmicas
        for (const key in options) {
            if (key.startsWith('option[')) {
                const optionName = key.match(/option\[(.*?)\]/)[1];
                include.push({
                    model: ProductOption, // <-- CORRIGIDO: ProductOption
                    as: 'options',
                    where: {
                        name: optionName,
                        value: options[key],
                    },
                });
            }
        }

        const offset = (page - 1) * limit;

        const { rows, count } = await Product.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset,
            distinct: true, // Garante contagem correta com includes
        });

        return { data: rows, total: count, limit: parseInt(limit), page: parseInt(page) };
    },

    async getById(id) {
        return await Product.findByPk(id, {
            include: [
                { model: Category, as: 'categories', through: { model: ProductCategory, attributes: [] } }, // <-- CORRIGIDO: model: ProductCategory
                { model: ProductImage, as: 'images', attributes: ['path'] }, // <-- CORRIGIDO: ProductImage e atributo 'path'
                { model: ProductOption, as: 'options' }, // <-- CORRIGIDO: ProductOption
            ],
        });
    },

    async create(data) {
        const { category_ids, images, options, ...productData } = data;

        const product = await Product.create(productData);

        // Relacionar categorias
        if (Array.isArray(category_ids) && category_ids.length > 0) {
            await product.setCategories(category_ids);
        }

        // Salvar imagens
        if (Array.isArray(images) && images.length > 0) {
            for (const img of images) { // Alterei para 'img' para clareza
                if (img.url && img.url.startsWith('data:image')) { // Assumindo base64 via 'url' no payload
                    const filename = saveBase64Image(img.url);
                    await ProductImage.create({ path: filename, productId: product.id, is_main: img.is_main, alt_text: img.alt_text }); // <-- CORRIGIDO: ProductImage e atributo 'path', e salvando outros atributos
                } else if (img.url) { // Se for uma URL externa
                    await ProductImage.create({ path: img.url, productId: product.id, is_main: img.is_main, alt_text: img.alt_text }); // <-- CORRIGIDO: ProductImage e atributo 'path'
                }
            }
        }

        // Criar opções
        if (Array.isArray(options) && options.length > 0) {
            for (const opt of options) {
                await ProductOption.create({ ...opt, productId: product.id }); // <-- CORRIGIDO: ProductOption
            }
        }

        return await this.getById(product.id);
    },

    async update(id, data) {
        const product = await Product.findByPk(id);
        if (!product) return null;

        const { category_ids, images, options, ...productData } = data;

        await product.update(productData);

        // Atualizar categorias
        if (Array.isArray(category_ids) && category_ids.length > 0) {
            await product.setCategories(category_ids);
        } else if (category_ids === null) { // Permite remover todas as categorias se category_ids for null
            await product.setCategories([]);
        }

        // Atualizar imagens (remover e adicionar novas)
        if (Array.isArray(images)) {
            await ProductImage.destroy({ where: { productId: id } }); // <-- CORRIGIDO: ProductImage
            if (images.length > 0) {
                for (const img of images) {
                    if (img.url && img.url.startsWith('data:image')) {
                        const filename = saveBase64Image(img.url);
                        await ProductImage.create({ path: filename, productId: id, is_main: img.is_main, alt_text: img.alt_text }); // <-- CORRIGIDO: ProductImage e atributo 'path'
                    } else if (img.url) {
                        await ProductImage.create({ path: img.url, productId: id, is_main: img.is_main, alt_text: img.alt_text }); // <-- CORRIGIDO: ProductImage e atributo 'path'
                    }
                }
            }
        }

        // Atualizar opções
        if (Array.isArray(options)) {
            await ProductOption.destroy({ where: { productId: id } }); // <-- CORRIGIDO: ProductOption
            if (options.length > 0) {
                for (const opt of options) {
                    await ProductOption.create({ ...opt, productId: id }); // <-- CORRIGIDO: ProductOption
                }
            }
        }

        return await this.getById(id); // Retorna o produto atualizado completo
    },

    async remove(id) {
        const product = await Product.findByPk(id);
        if (!product) return false;

        await ProductOption.destroy({ where: { productId: id } }); // <-- CORRIGIDO: ProductOption
        await ProductImage.destroy({ where: { productId: id } }); // <-- CORRIGIDO: ProductImage
        await product.setCategories([]); // remove associações de categorias
        await product.destroy();

        return true;
    },
};