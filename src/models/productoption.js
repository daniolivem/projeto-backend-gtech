'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductOption extends Model {
    static associate(models) {
      // ProductOption pertence a Product
      ProductOption.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  ProductOption.init({
    product_id: { // Definido aqui para clareza, mas gerenciado pela associação
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
      // Getter e Setter para lidar com a string de valores como um array (opcional avançado)
      // get() {
      //   const rawValue = this.getDataValue('values');
      //   return rawValue ? rawValue.split(',') : [];
      // },
      // set(value) {
      //   if (Array.isArray(value)) {
      //     this.setDataValue('values', value.join(','));
      //   } else {
      //     this.setDataValue('values', value);
      //   }
      // }
    }
  }, {
    sequelize,
    modelName: 'ProductOption',
    timestamps: true
  });
  return ProductOption;
};