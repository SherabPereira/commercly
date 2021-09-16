const { Schema, model } = require('mongoose')

module.exports = model(
  'Product',
  new Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
      },
      price: {
        type: Number,
        required: true,
        minlength: 0,
      },
      description: {
        type: String,
        required: true,
        minlength: 5,
      },
      brand: {
        type: String,
        maxlength: 15,
        minlength: 2,
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      image: {
        originalName: String,
        path: String,
      },
    },
    {
      timestamps: true,
    },
  ),
)
