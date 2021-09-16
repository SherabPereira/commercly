const { Schema, model } = require('mongoose')

module.exports = model(
  'Category',
  new Schema(
    {
      name: {
        type: String,
        minlength: 3,
        required: true,
      },
      description: String,
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
