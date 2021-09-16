const isLoggedIn = (req, res, next) => {
  console.log(req.session.currentUser, 'loggedIn')
  if (!req.session.currentUser) {
    console.log('isloggedout')
    return res.redirect("/auth/login");
  }
  console.log('isloggedin', 'loggedIn')
  next();
};

const isLoggedOut = (req, res, next) => {
  console.log(req.session.currentUser, 'loggedOut')
  if (req.session.currentUser) {
    console.log('isloggedin')
    if(req.session.currentUser.isAdmin)  return res.redirect("/admin")
    else res.redirect("/user")
   
  }
  console.log('isloggedout' , 'loggedOut')
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
