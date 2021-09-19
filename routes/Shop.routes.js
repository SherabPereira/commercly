const router = require('express').Router()
const Category = require('../models/Category.model')
const Product = require('../models/Product.model')
const Cart = require('../models/Cart.model')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')

//GET Shop products list
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find()
    const products = await Product.find()
    res.render('shop/product-gallery', { categories, products })
  } catch (err) {}
})

//GET Find products of category
router.get('/filter/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const category = await Category.findById(id).populate('products')
    const categories = await Category.find()

    res.render('shop/product-gallery', {
      products: category.products,
      categories,
    })
  } catch (err) {
    next(err)
  }
})

//POST Find products by name or brand
router.post('/search', async (req, res, next) => {
  const { query } = req.body

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
      ],
    })
    const categories = await Category.find()

    res.render('shop/product-gallery', {
      products,
      categories,
    })
  } catch (err) {
    next(err)
  }
})

//POST Find products by name or brand
router.get('/cart', isLoggedIn, async (req, res, next) => {
  const cart = await Cart.findById(req.session.currentCartId).populate(
    'products',
  )

  console.log()

  let itemsCounter = {}
  let productsArray = []
  let totalItems = 0
  let totalPrice = 0

  cart.products.forEach((obj) => {
    var key = JSON.stringify(obj)
    itemsCounter[key] = (itemsCounter[key] || 0) + 1
  })

  itemsCounter = Object.entries(itemsCounter)

  for (const item of itemsCounter) {
    const product = JSON.parse(item[0])
    const quantity = item[1]
    const totalLine = quantity * product.price
    totalItems += item[1]
    totalPrice += totalLine

    productsArray.push({
      product: product,
      quantity: quantity,
      totalLine: totalLine,
    })
  }

  res.render('shop/cart', {
    products: productsArray,
    totalItems: totalItems,
    totalPrice: totalPrice,
  })
})

//GET add product to cart
router.post('/add-item', isLoggedIn, async (req, res, next) => {
  const { productId } = req.body
  const cartId = req.session.currentCartId

  /**/

  const cart = await Cart.findOneAndUpdate(
    { _id: cartId },
    {
      $push: { products: { _id: productId } },
    },
    { new: true },
  )

  console.log(cart)
  // req.session.totalItems = cart.products.length

  res.redirect(`/products/${productId}`)
})

module.exports = router
