'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductOption extends Model {
    static associate(models) {
      ProductOption.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  ProductOption.init({
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O título da opção não pode ser vazio.' }
      }
    },
    shape: {
      type: DataTypes.ENUM('square', 'circle'),
      allowNull: false,
      defaultValue: 'square',
      validate: {
        isIn: {
          args: [['square', 'circle']],
          msg: 'Shape deve ser "square" ou "circle".'
        }
      }
    },
    radius: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: 'Radius deve ser um número inteiro.' },
        min: { args: [0], msg: 'Radius não pode ser negativo.' }
      }
    },
    type: {
      type: DataTypes.ENUM('text', 'color'),
      allowNull: false,
      defaultValue: 'text',
      validate: {
        isIn: {
          args: [['text', 'color']],
          msg: 'Type deve ser "text" ou "color".'
        }
      }
    },
    values: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O campo "values" não pode ser vazio.' }
      }
    }
  }, {
    sequelize,
    modelName: 'ProductOption',
    timestamps: true
  });
  return ProductOption;
};