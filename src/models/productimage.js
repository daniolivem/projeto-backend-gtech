// src/models/productimage.js (ou nome similar)
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      // Define a associação: ProductImage pertence a Product
      ProductImage.belongsTo(models.Product, {
        foreignKey: 'product_id', // Chave estrangeira nesta tabela (ProductImage)
        as: 'product',          // Alias para acessar o produto associado (opcional, mas útil)
        onDelete: 'CASCADE',    // Consistente com a migração
        onUpdate: 'CASCADE'
      });
    }
  }
  ProductImage.init({
    // product_id é a chave estrangeira, será gerenciada pela associação
    // mas é bom tê-la definida se você for criar registros diretamente.
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: { model: 'Products', key: 'id' } // A associação já cuida disso no Sequelize
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O caminho da imagem não pode ser vazio.' }
      }
    }
  }, {
    sequelize,
    modelName: 'ProductImage',
    timestamps: true
  });
  return ProductImage;
};
