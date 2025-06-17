
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
 as: 'images'
      });
      Product.hasMany(models.ProductOption, {
        foreignKey: 'product_id',
 as: 'options'
      });
      Product.belongsToMany(models.Category, {
 through: models.ProductCategory,
 foreignKey: 'product_id',
 otherKey: 'category_id',
 as: 'categories'
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
      allowNull: true
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
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: true
  });
  return Product;
};