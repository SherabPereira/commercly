const router = require('express').Router()

const Category = require('../models/Category.model')
const Product = require('../models/Product.model')

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

module.exports = router
