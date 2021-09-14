const router = require("express").Router();

//GET List categories
router.get("/", (_, res, next) => {
  res.render("users/admin/panel");
});

module.exports = router;
