// src/models/product.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Aqui você pode definir as associações desse modelo com outros.
     * O Sequelize chama esse método automaticamente.
     * Exemplo de uso:
     * Product.belongsToMany(models.Category, { through: 'ProductCategories', foreignKey: 'product_id', as: 'categories' });
     * Product.hasMany(models.ProductImage, { foreignKey: 'product_id', as: 'images' });
     * Product.hasMany(models.ProductOption, { foreignKey: 'product_id', as: 'options' });
     */
    static associate(models) {
      // Associações vão aqui no futuro
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id', // Chave estrangeira na tabela ProductImage
        as: 'images'            // Alias para acessar as imagens (ex: product.getImages())
      });
      Product.hasMany(models.ProductOption, {
        foreignKey: 'product_id',
        as: 'options' // Alias para acessar as opções (ex: product.getOptions())
      });
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory, // Modelo da tabela de junção
        foreignKey: 'product_id',      // Chave em ProductCategory que se refere a Product
        otherKey: 'category_id',       // Chave em ProductCategory que se refere a Category
        as: 'categories'               // Alias para acessar as categorias do produto
      });
    }
  }
  Product.init({
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isIn: { args: [[true, false]], msg: 'Valor inválido para "enabled".' }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O nome do produto não pode ser vazio.' }
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Este slug de produto já está em uso.'
      },
      validate: {
        notEmpty: { msg: 'O slug do produto não pode ser vazio.' }
      }
    },
    use_in_menu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isIn: { args: [[true, false]], msg: 'Valor inválido para "use_in_menu".' }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'O estoque tem que ser um número inteiro.' },
        min: { args: [0], msg: 'O estoque não pode ser negativo.' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true // Pode ser nulo, então não precisa se preocupar se está vazio
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: 'O preço tem que ser um número.' },
        notNull: { msg: 'O preço é obrigatório.' }, // notEmpty não faz sentido pra número, melhor usar notNull
        min: { args: [0], msg: 'O preço não pode ser negativo.' }
      }
    },
    price_with_discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: 'O preço com desconto tem que ser um número.' },
        notNull: { msg: 'O preço com desconto é obrigatório.' },
        min: { args: [0], msg: 'O preço com desconto não pode ser negativo.' },
        // Se quiser, dá pra colocar uma validação aqui pra garantir que
        // price_with_discount <= price, se fizer sentido pra você.
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: true
  });
  return Product;
};