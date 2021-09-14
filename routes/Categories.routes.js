const router = require("express").Router();

const Category = require("../models/Category.model");

//GET List categories
router.get("/", (_, res, next) => {
  Category.find()
    .then((categories) => {
      res.render("categories/categories-list", { categories: categories });
    })
    .catch((err) => next(err));
});

//GET create category
router.get("/create", (_, res, next) => {
  res.render("categories/new-category");
});

//POST create category
router.post("/create", (req, res, next) => {
  const { name } = req.body;

  Category.create({ name })
    .then(() => res.redirect("/categories"))
    .catch((err) => res.render("categories/new-category", err.message));
});

//GET Find category
router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  Category.findById(id)
    .populate("products")
    .then((category) => {
      // console.log(category)
      res.render("categories/category-details", category);
    })
    .catch((err) => next(err));
});

//POST delete category // Check if category products is empty, otherwise need warning to delete the products associated first
router.post("/delete/:id", (req, res, next) => {
  const { id } = req.params;

  Category.findByIdAndRemove(id)
    .then(res.redirect("/categories"))
    .catch((err) => next(err));
});

//GET Edit category
router.get("/edit/:id", (req, res, next) => {
  const { id } = req.params;

  Category.findById(id)
    .populate("products")
    .then((category) =>
      res.render("categories/edit-category", { category: category })
    )
    .catch((err) => next(err));
});

//POST edit product
router.post("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  Category.findByIdAndUpdate(id, { name })
    .then(res.redirect(`/categories/${id}`))
    .catch((err) => next(err));
});

module.exports = router;
