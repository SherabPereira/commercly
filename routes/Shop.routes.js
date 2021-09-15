const router = require("express").Router();

const Category = require("../models/Category.model");
const Product = require("../models/Product.model");

//GET Shop products list
router.get("/", async (req, res, next) => {
  const categories = await Category.find();
  const products = await Product.find();

  res.render("shop/product-gallery", { categories, products });
});

module.exports = router;
