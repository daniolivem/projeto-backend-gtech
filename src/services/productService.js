// src/services/productService.js
// Importação dos modelos com os nomes exatos definidos nos arquivos de modelo e em index.js
const { Product, Category, ProductImage, ProductOption, ProductCategory } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Função para salvar imagem base64
// ATENÇÃO: Certifique-se de que a pasta 'uploads' exista na raiz do seu projeto ou crie-a dinamicamente.
function saveBase64Image(base64, folder = 'uploads') {
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Formato de imagem inválido');

    const ext = matches[1].split('/')[1];
    const data = matches[2];
    const filename = `${Date.now()}.${ext}`;

    // Caminho absoluto para a pasta 'uploads' na raiz do projeto
    // '__dirname' é o diretório do arquivo atual (services)
    // '..' volta para 'src'
    // '..' volta para a raiz do projeto
    const uploadDir = path.join(__dirname, '..', '..', folder);

    // Cria a pasta 'uploads' se ela não existir
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
    return filename; // Retorna apenas o nome do arquivo, a URL completa será construída no frontend ou via uma rota de arquivos estáticos no backend
}


module.exports = {
    async search({ limit = 10, page = 1, fields, match, category_ids, priceRange, options }) {
        const where = {};
        const include = [
            { model: ProductImage, as: 'images', attributes: ['path', 'alt_text', 'is_main'] },
            // CORRIGIDO: Atributos da opção alinhados ao modelo ProductOption.js
            { model: ProductOption, as: 'options', attributes: ['title', 'shape', 'radius', 'type', 'values'] },
        ];

        // Filtro por campo específico
        if (match && fields) {
            where[fields] = { [Op.like]: `%${match}%` };
        }

        // Filtro por categorias (usando Product_Categories explicitamente como tabela 'through')
        if (category_ids) {
            include.push({
                model: Category,
                as: 'categories',
                where: { id: { [Op.in]: category_ids.split(',') } },
                through: { model: ProductCategory, attributes: [] }, // Usa o modelo da tabela de junção
                required: true // Garante que apenas produtos com as categorias filtradas sejam retornados
            });
        } else {
            // Se não houver filtro de categoria, ainda inclua a associação para retornar as categorias do produto
            include.push({ model: Category, as: 'categories', through: { model: ProductCategory, attributes: [] } });
        }

        // Filtro por faixa de preço
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(parseFloat);
            if (!isNaN(min) && !isNaN(max)) { // Garante que min e max são números válidos
                where.price = { [Op.between]: [min, max] };
            }
        }

        // Filtro por opções dinâmicas
        for (const key in options) {
            if (key.startsWith('option[')) {
                const optionName = key.match(/option\[(.*?)\]/)[1];
                if (optionName) { // Garante que o nome da opção foi extraído
                    include.push({
                        model: ProductOption,
                        as: 'options',
                        where: {
                            // CORRIGIDO: Usar 'title' e 'values' como no modelo ProductOption.js
                            title: optionName, // Supondo que 'optionName' se refere ao 'title' da opção
                            values: options[key], // Supondo que 'options[key]' se refere a 'values' no modelo (pode ser necessário ajuste se a lógica de filtro for diferente)
                        },
                        required: true // Garante que apenas produtos com a opção filtrada sejam retornados
                    });
                }
            }
        }

        const offset = (page - 1) * limit;

        const { rows, count } = await Product.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset,
            distinct: true, // Importante para contagem correta com includes
        });

        return { data: rows, total: count, limit: parseInt(limit), page: parseInt(page) };
    },

    async getById(id) {
        return await Product.findByPk(id, {
            include: [
                { model: Category, as: 'categories', through: { model: ProductCategory, attributes: [] } },
                { model: ProductImage, as: 'images', attributes: ['path', 'alt_text', 'is_main'] },
                // CORRIGIDO: Atributos da opção alinhados ao modelo ProductOption.js
                { model: ProductOption, as: 'options', attributes: ['title', 'shape', 'radius', 'type', 'values'] },
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
            for (const img of images) {
                if (img.url && img.url.startsWith('data:image')) {
                    const filename = saveBase64Image(img.url);
                    await ProductImage.create({ path: filename, product_id: product.id, is_main: img.is_main || false, alt_text: img.alt_text || null });
                } else if (img.url) {
                    await ProductImage.create({ path: img.url, product_id: product.id, is_main: img.is_main || false, alt_text: img.alt_text || null });
                }
            }
        }

        // Criar opções
        if (Array.isArray(options) && options.length > 0) {
            for (const opt of options) {
                // Ao criar, o spread operator `...opt` já deve passar 'title', 'shape', 'radius', 'type', 'values'
                // se eles estiverem no objeto 'opt' do payload.
                // O importante é que o payload do Postman envie esses campos.
                await ProductOption.create({ ...opt, product_id: product.id });
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
        } else if (category_ids === null) {
            await product.setCategories([]);
        }

        // Atualizar imagens (remover e adicionar novas)
        if (Array.isArray(images)) {
            await ProductImage.destroy({ where: { product_id: id } });
            if (images.length > 0) {
                for (const img of images) {
                    if (img.url && img.url.startsWith('data:image')) {
                        const filename = saveBase64Image(img.url);
                        await ProductImage.create({ path: filename, product_id: id, is_main: img.is_main || false, alt_text: img.alt_text || null });
                    } else if (img.url) {
                        await ProductImage.create({ path: img.url, product_id: id, is_main: img.is_main || false, alt_text: img.alt_text || null });
                    }
                }
            }
        }

        // Atualizar opções
        if (Array.isArray(options)) {
            await ProductOption.destroy({ where: { product_id: id } });
            if (options.length > 0) {
                for (const opt of options) {
                    // Ao atualizar, o spread operator `...opt` já deve passar 'title', 'shape', 'radius', 'type', 'values'
                    await ProductOption.create({ ...opt, product_id: id });
                }
            }
        }

        return await this.getById(id);
    },

    async remove(id) {
        const product = await Product.findByPk(id);
        if (!product) return false;

        await ProductOption.destroy({ where: { product_id: id } });
        await ProductImage.destroy({ where: { product_id: id } });
        await product.setCategories([]);
        await product.destroy();

        return true;
    },
};