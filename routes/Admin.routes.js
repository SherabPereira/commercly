const router = require('express').Router()
const { isAdmin } = require('../middleware/route-guard')

//GET List categories
router.get('/', isAdmin, (_, res, next) => {
  res.render('account/admin/dashboard')
})

module.exports = router
