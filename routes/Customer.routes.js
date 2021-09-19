const router = require('express').Router()
const Address = require('../models/Address.model')
const User = require('../models/User.model')

//GET Customer dashboard
router.get('/', (req, res, next) => {
  res.render('account/customer/dashboard', {
    username: req.session.currentUser.username,
  })
})

//GET List of customer addresses
router.get('/address-list', async (req, res, next) => {
  const id = req.session.currentUser._id

  const user = await User.findById(id).populate(
    'addresses.billing addresses.shipping',
  )

  res.render('account/customer/address-list', {
    billing: user.addresses.billing,
    shipping: user.addresses.shipping,
  })
})

//GET View create address
router.get('/create-address/:type', async (req, res, next) => {
  const { type } = req.params

  if (type === 'billing') res.render('account/customer/create-address-billing')
  else if (type === 'shipping')
    res.render('account/customer/create-address-shipping')
})

//POST Create  address
router.post('/create-address/:type', async (req, res, next) => {
  const { type } = req.params
  const user = req.session.currentUser._id
  const {
    firstName,
    lastName,
    company,
    country,
    street,
    zip,
    city,
    province,
    phone,
    email,
  } = req.body

  try {
    const address = await Address.create({
      user,
      type,
      firstName,
      lastName,
      company,
      country,
      street,
      zip,
      city,
      province,
      phone,
      email,
    })

    if (type === 'billing')
      await User.findByIdAndUpdate(user, { 'addresses.billing': address._id })
    else if (type === 'shipping')
      await User.findByIdAndUpdate(user, { 'addresses.shipping': address._id })

    res.redirect('/customer/address-list')
  } catch (err) {
    next(err)
  }
})

//GET View edit address
router.get('/edit-address/:type', async (req, res, next) => {
  const { type } = req.params

  const user = req.session.currentUser._id

  const address = await Address.findOne({ user: user, type: type })

  if (type === 'billing')
    res.render('account/customer/edit-address-billing', { address: address })
  else if (type === 'shipping')
    res.render('account/customer/edit-address-shipping', { address: address })
})

//POST Edit address
router.post('/edit-address/:type', async (req, res, next) => {
  const { type } = req.params
  const user = req.session.currentUser._id
  const {
    id,
    firstName,
    lastName,
    company,
    country,
    street,
    zip,
    city,
    province,
    phone,
    email,
  } = req.body

  try {
    const address = await Address.findByIdAndUpdate(id, {
      user,
      type,
      firstName,
      lastName,
      company,
      country,
      street,
      zip,
      city,
      province,
      phone,
      email,
    })

    if (type === 'billing')
      await User.findByIdAndUpdate(user, { 'addresses.billing': address._id })
    else if (type === 'shipping')
      await User.findByIdAndUpdate(user, { 'addresses.shipping': address._id })

    res.redirect('/customer/address-list')
  } catch (err) {
    next(err)
  }
})

module.exports = router
