const { Schema, model } = require('mongoose')

module.exports = model(
  'Cart',
  new Schema(
    {
      customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      products: {
        type: [Schema.Types.ObjectId],
        ref: 'Product',
      },
    },
    {
      timestamps: true,
    },
  ),
)

