const { Schema, model } = require("mongoose");

module.exports = model(
  "Product",
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
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      image: {
        name: String,
        path: String,
        originalName: String,
      },
    },
    {
      timestamps: true,
    }
  )
);
