const router = require('express').Router()
const { isAdmin } = require('../middleware/route-guard')

//GET Admin dashboard
router.get('/', isAdmin, (req, res, next) => {

  console.log(req.session.currentUser['username'])



  res.render('account/admin/dashboard', {
    username: req.session.currentUser.username,
  })
})

module.exports = router
