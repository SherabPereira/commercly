const { Schema, model } = require('mongoose')

module.exports = model(
  'Order',
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      orderLines: [
        {
          quantity: {
            type: Number,
            required: true,
          },
          productId: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          totalLine: {
            type: Number,
            required: true,
          },
          totalOrder: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    {
      timestamps: true,
    },
  ),
)

/*
user
date
orderLines
    quantity
    productId
    totaLine
totalOrder
*/
