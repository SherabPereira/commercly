const router = require('express').Router()

const Category = require('../models/Category.model')
const Product = require('../models/Product.model')

//GET List categories
router.get('/', (_, res, next) => {
  Category.find()
    .then((categories) => {
      res.render('categories/categories-list', { categories: categories })
    })
    .catch((err) => next(err))
})

//GET create category
router.get('/create', (_, res, next) => {
  res.render('categories/new-category')
})

//POST create category
router.post('/create', (req, res, next) => {
  const { name, description } = req.body

  Category.create({ name, description })
    .then(() => res.redirect('/categories'))
    .catch((err) => res.render('categories/new-category', err.message))
})

//GET Find category
router.get('/:id', (req, res, next) => {
  const { id } = req.params

  Category.findById(id)
    .populate('products')
    .then((category) => {
      // console.log(category)
      res.render('categories/category-details', category)
    })
    .catch((err) => next(err))
})

//POST Search products by name or brand
router.post('/search', async (req, res, next) => {
  const { query } = req.body
  try {
    const categories = await Category.find({
      name: { $regex: query, $options: 'i' },
    })
    res.render('categories/categories-list', {
      categories,
    })
  } catch (err) {
    next(err)
  }
})

//POST delete category // Check if category products is empty, otherwise need warning to delete the products associated first
router.post('/delete/:id', (req, res, next) => {
  const { id } = req.params

  Product.find({ category: { $eq: id } })
    .then(async (results) => {
      if (results.length === 0) {
        await Category.findByIdAndRemove(id).then(res.redirect('/categories'))
      } else {
        req.flash(
          'info',
          'There are products using the this category. Category could not be deleted.',
        )
        res.redirect('/')
      }
    })
    .catch((err) =>
      res.render('categories/categories-list', { errMessage: err.message }),
    )
})

//GET Edit category
router.get('/edit/:id', (req, res, next) => {
  const { id } = req.params

  Category.findById(id)
    .populate('products')
    .then((category) =>
      res.render('categories/edit-category', { category: category }),
    )
    .catch((err) => next(err))
})

//POST edit product
router.post('/edit/:id', (req, res, next) => {
  const { id } = req.params
  const { name, description } = req.body

  Category.findByIdAndUpdate(id, { name, description })
    .then(res.redirect(`/categories`))
    .catch((err) => next(err))
})

module.exports = router
