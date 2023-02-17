const express = require("express");
const router = express.Router();
const Record = require("../../models/record");
const Category = require("../../models/category");

//拿New樣板
router.get("/new", (req, res) => {
  Category.find()
    .lean()
    .sort({ _id: "asc" })
    .then((categories) => {
      return res.render("new", { categories });
    })
    .catch((error) => console.log(error));
});

//接住表單資料 Create
router.post("/", (req, res) => {
  const userId = req.user._id;
  req.body.userId = userId;
  Record.create(req.body) //存入資料庫
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error))
});

//編輯資料
router.get("/:id/edit", async (req, res) => {
  try {
    const _id = req.params.id
    const userId = req.user._id
    const record = await Record.findOne({ _id, userId }).lean()
    const category = await Category.findOne({ _id: record.categoryId })
    record.categoryName = category.categoryName
    record.date = record.date.toISOString().slice(0, 10)
    res.render('edit', { record })
  }
  catch (error) {
    console.log(error)
  }
});

//接住資料送往資料庫
router.put("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const userId = req.user._id;
    const categoryItem = await Category.findOne({ categoryName: req.body.category });
    const record = await Record.findOne({ _id, userId });
    record.name = req.body.name;
    record.date = req.body.date;
    record.amount = req.body.amount;
    record.categoryId = categoryItem._id;
    record.save();
    res.redirect("/");
  }
  catch (error) {
    console.log(error)
  }
});

//刪除
router.delete("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  return Record.findOne({ _id, userId })
    .then((record) => record.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
