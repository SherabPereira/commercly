const { Schema, model } = require('mongoose')

module.exports = model(
  'Address',
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      type: String,
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      company: String,
      country: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      zip: {
        type: Number,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    },
  ),
)
