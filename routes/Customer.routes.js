const router = require('express').Router()

//GET List Customer dashboard
router.get('/', (req, res, next) => {
  res.render('account/customer/dashboard', {
    username: req.session.currentUser.username,
  })
})

module.exports = router
