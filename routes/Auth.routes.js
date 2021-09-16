const router = require('express').Router()
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')
const User = require('../models/User.model')

const saltRounds = 10

router.get('/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', isLoggedOut, (req, res) => {
  const { password, email, token } = req.body

  console.log(token, "<<<<<<<<<<<<<<<<<<<<<<")

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
    // If the user is found, send the message email is taken
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
        if (token === process.env.ADMIN_TOKEN) {
          console.log('entered')
          return User.create({
            email,
            password: hashedPassword,
            isAdmin: true,
          })
        } else {
          return User.create({
            email,
            password: hashedPassword,
            isAdmin: false,
          })
        }
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user
        res.redirect('/')
      })
      .catch((error) => {
        console.log(error.message)
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

router.post('/login', isLoggedOut, (req, res, next) => {
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
      bcryptjs.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render('auth/login', { errorMessage: 'Wrong credentials.' })
        }
        /*debug*/
        req.session.user = user

        //If user is admin redirect to admin panel else to user panel.
        if (user.isAdmin) return res.redirect('/admin')
        else return res.redirect('/client')

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
