const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  }
  next()
}

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    if (req.session.currentUser.isAdmin) return res.redirect('/admin')
    else return res.redirect('/customer')
  }
  next()
}

const isAdmin = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login')
  } else {
    if (!req.session.currentUser.isAdmin) {
      res.redirect('/customer')
    }
  }
  next()
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdmin,
}
