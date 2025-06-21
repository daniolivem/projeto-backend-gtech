const { Product, Category, Image, Option } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Função para salvar imagem base64
function saveBase64Image(base64, folder = 'uploads') {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error('Formato de imagem inválido');

  const ext = matches[1].split('/')[1];
  const data = matches[2];
  const filename = `${Date.now()}.${ext}`;
  const filepath = path.join(__dirname, '..', folder, filename);

  fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
  return filename;
}

module.exports = {
  async search({ limit = 10, page = 1, fields, match, category_ids, priceRange, options }) {
    const where = {};
    const include = [
      { model: Image, as: 'images', attributes: ['url'] },
      { model: Option, as: 'options' },
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
        through: { attributes: [] },
      });
    } else {
      include.push({ model: Category, as: 'categories', through: { attributes: [] } });
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
          model: Option,
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
      distinct: true,
    });

    return { data: rows, total: count, limit: parseInt(limit), page: parseInt(page) };
  },

  async getById(id) {
    return await Product.findByPk(id, {
      include: [
        { model: Category, as: 'categories', through: { attributes: [] } },
        { model: Image, as: 'images', attributes: ['url'] },
        { model: Option, as: 'options' },
      ],
    });
  },

  async create(data) {
    const { category_ids, images, options, ...productData } = data;

    const product = await Product.create(productData);

    // Relacionar categorias
    if (Array.isArray(category_ids)) {
      await product.setCategories(category_ids);
    }

    // Salvar imagens
    if (Array.isArray(images)) {
      for (const base64 of images) {
        const filename = saveBase64Image(base64);
        await Image.create({ url: filename, productId: product.id });
      }
    }

    // Criar opções
    if (Array.isArray(options)) {
      for (const opt of options) {
        await Option.create({ ...opt, productId: product.id });
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
    if (Array.isArray(category_ids)) {
      await product.setCategories(category_ids);
    }

    // Atualizar imagens (remover e adicionar novas)
    if (Array.isArray(images)) {
      await Image.destroy({ where: { productId: id } });
      for (const base64 of images) {
        const filename = saveBase64Image(base64);
        await Image.create({ url: filename, productId: id });
      }
    }

    // Atualizar opções
    if (Array.isArray(options)) {
      await Option.destroy({ where: { productId: id } });
      for (const opt of options) {
        await Option.create({ ...opt, productId: id });
      }
    }

    return true;
  },

  async remove(id) {
    const product = await Product.findByPk(id);
    if (!product) return false;

    await Option.destroy({ where: { productId: id } });
    await Image.destroy({ where: { productId: id } });
    await product.setCategories([]); // remove associações
    await product.destroy();

    return true;
  },
};
be