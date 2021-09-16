const router = require("express").Router();

//GET List categories
router.get("/", (_, res, next) => {
  res.render("account/customer/dashboard");
});

module.exports = router;