const router = require("express").Router();

const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

//GET List products
router.get("/", (_, res, next) => {
  Product.find()
    .populate("category")
    .then((products) =>
      res.render("products/products-list", { products: products })
    )
    .catch((err) => next(err));
});

//GET create product
router.get("/create", (_, res, next) => {
  Category.find()
    .then((categories) => {
      res.render("products/new-product", { categories: categories });
    })
    .catch((err) => next(err));
});

//POST create product
router.post("/create", (req, res, next) => {
  const { name, price, description, category } = req.body;

  Product.create({ name, price, description, category })
    .then(async (product) => {
      await Category.findByIdAndUpdate(category, {
        $push: { products: { _id: product._id } },
      });
    })
    .then(res.redirect("/products"))
    .catch((err) => next(err));
});

//GET Find product
router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Product.findById(id)
    .populate("category")
    .then((product) => res.render("products/product-details", product))
    .catch((err) => next(err));
});

//POST delete product
router.post("/delete/:id", (req, res, next) => {
  const { id } = req.params;

  Product.findByIdAndRemove(id)
    .then(res.redirect("/products"))
    .catch((err) => next(err));
});

//GET Edit product
router.get("/edit/:id", (req, res, next) => {
  const { id } = req.params;

  Promise.all([Product.findById(id), Category.find()])
    .then(([product, category]) =>
      res.render("products/edit-product", { product, category })
    )
    .catch((err) => next(err));
});

//POST edit product
router.post("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, price, description, category } = req.body;

  Movie.findByIdAndUpdate(id, { name, price, description, category })
    .then(res.redirect(`/product/${id}`))
    .catch((err) => next(err));
});

module.exports = router;
