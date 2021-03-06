const router = require('express').Router()
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')
const User = require('../models/User.model')
const Cart = require('../models/Cart.model')

const saltRounds = 10

//GET USER DASHBOARD

/*{ user: req.session.currentUser }*/

router.get('/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res) => {
  const { password, email, token } = req.body

  if (!email) {
    return res
      .status(400)
      .render('auth/signup', { errorMessage: 'Please provide your email.' })
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/

  if (!regex.test(password)) {
    return res.status(400).render('auth/signup', {
      errorMessage:
        'Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.',
    })
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email }).then((found) => {
    // If the email is found, send the message email is taken
    if (found) {
      return res
        .status(400)
        .render('auth/signup', { errorMessage: 'Email already taken.' })
    }

    // if user is not found, create a new user - start with hashing the password
    return bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt)) /*debug*/
      .then((hashedPassword) => {
        // Create a user and save it in the database

        //Take the first part of the email to use as predefined username

        let username = email.substring(0, email.indexOf('@'))
        username = username.charAt(0).toUpperCase() + username.slice(1)

        if (token === process.env.ADMIN_TOKEN) {
          return User.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: true,
          })
        } else {
          return User.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: false,
          })
        }
      })
      .then(async (user) => {
        // Bind the user to the session object
        req.session.currentUser = user

        //Create a cart for the costumer
        const cart = await Cart.create({ customer: user.id })
        req.session.currentCartId = cart._id

        //If user is admin redirect to admin panel else to user panel.
        if (user.isAdmin) return res.redirect('/admin')
        else return res.redirect('/customer')
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render('auth/signup', { errorMessage: error.message })
        }
        if (error.code === 11000) {
          return res.status(400).render('auth/signup', {
            errorMessage:
              'Email need to be unique. The email you chose is already in use.',
          })
        }
        return res
          .status(500)
          .render('auth/signup', { errorMessage: error.message })
      })
  })
})

router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  const { email, password } = req.body

  if (!email) {
    return res
      .status(400)
      .render('auth/login', { errorMessage: 'Please provide your email.' })
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render('auth/login', {
      errorMessage: 'Your password needs to be at least 8 characters long.',
    })
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render('auth/login', { errorMessage: 'Wrong credentials.' })
      }

      // If user is found based on the email, check if the in putted password matches the one saved in the database
      bcryptjs.compare(password, user.password).then(async (isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render('auth/login', { errorMessage: 'Wrong credentials.' })
        }

        req.session.currentUser = user

        //Check if user has cart
        let cart = await Cart.findOne({ customer: { $eq: user.id } })
        //Else create it
        if (!cart) {
          cart = await Cart.create({ customer: user.id })
        }

        req.session.currentCartId = cart._id
        req.session.totalItemsCart = cart.products.length

        //If user is admin redirect to admin panel else to user panel.
        if (user.isAdmin) return res.redirect('/admin')
        else return res.redirect('/customer')

        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
      })
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err)
      // return res.status(500).render("login", { errorMessage: err.message });
    })
})

router.get('/logout', isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render('auth/logout', { errorMessage: err.message })
    }
    res.redirect('/')
  })
})

module.exports = router
