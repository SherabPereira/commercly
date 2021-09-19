const router = require('express').Router()

/* GET home page */
router.get('/', (req, res, next) => {
  // res.render('index', { totalItemsCart: req.session.totalItems })
  res.render('index')
})

module.exports = router
