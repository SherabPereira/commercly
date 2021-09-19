const router = require('express').Router()
const User = require('../models/User.model')
const Category = require('../models/Category.model')
const Product = require('../models/Product.model')
const Cart = require('../models/Cart.model')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')
const CategoryModel = require('../models/Category.model')

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
  const userId = req.session.currentUser._id

  const user = await User.findById(userId).populate(
    'addresses.billing addresses.shipping',
  )

  const cart = await Cart.findById(req.session.currentCartId).populate(
    'products',
  )

  let itemsCounter = {}
  let productsArray = []
  let totalItems = 0
  let totalPrice = 0

  cart.products.forEach((obj) => {
    const key = JSON.stringify(obj)
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
    billing: user.addresses.billing,
  })
})

//POST add product to cart
router.post('/add-item', isLoggedIn, async (req, res, next) => {
  const { productId } = req.body
  const cartId = req.session.currentCartId

  const cart = await Cart.findOneAndUpdate(
    { _id: cartId },
    {
      $push: { products: { _id: productId } },
    },
    { new: true },
  )
  req.session.totalItemsCart = cart.products.length

  res.redirect(`/products/${productId}`)
})

//GET add product to cart
router.get('/cart/add-item/:productId', isLoggedIn, async (req, res, next) => {
  const { productId } = req.params
  const cartId = req.session.currentCartId

  const cart = await Cart.findOneAndUpdate(
    { _id: cartId },
    {
      $push: { products: { _id: productId } },
    },
    { new: true },
  )
  req.session.totalItemsCart = cart.products.length

  res.redirect(`/shop/cart`)
})

//GET remove product from cart
router.get(
  '/cart/remove-item/:productId',
  isLoggedIn,
  async (req, res, next) => {
    const { productId } = req.params
    const cartId = req.session.currentCartId

    const cart = await Cart.findById(cartId)

    const prodIndex = cart.products.findIndex(
      (product) => String(product) === productId,
    )

    if (prodIndex >= 0) cart.products.splice(prodIndex, 1)

    const modifiedCart = await Cart.findByIdAndUpdate(
      cartId,
      {
        products: cart.products,
      },
      { new: true },
    )

    req.session.totalItemsCart = modifiedCart.products.length

    res.redirect(`/shop/cart`)
  },
)

//GET remove product from cart
router.get(
  '/cart/remove-line/:productId',
  isLoggedIn,
  async (req, res, next) => {
    const { productId } = req.params
    const cartId = req.session.currentCartId

    const cart = await Cart.findOneAndUpdate(
      { _id: cartId },
      {
        $pull: { products: { $in: [productId] } },
      },
      { new: true },
    )

    req.session.totalItemsCart = cart.products.length

    res.redirect(`/shop/cart`)
  },
)

module.exports = router
