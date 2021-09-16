const { Schema, model } = require('mongoose')

module.exports = model(
  'User',
  new Schema(
    {
      name: {
        type: String,
        minlength: 2,
      },
      surname: {
        type: String,
        minlength: 2,
      },
      address: {
        country: String,
        street: String,
        city: String,
        zip: Number,
      },
      phone: String,
      username: String,
      email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      isAdmin: Boolean,
    },
    {
      timestamps: true,
    },
  ),
)
