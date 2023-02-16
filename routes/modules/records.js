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
router.get("/:id/edit", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  Promise.all([
    Category.find().lean().sort({ _id: "asc" }),
    Record.findOne({ _id, userId }).lean().sort({ date: "desc" }),
  ])
    .then((results) => {
      return res.render("edit", { record: results[1], categories: results[0] });
    })
    .catch((error) => console.log(error));
});

//接住資料送往資料庫
router.put("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  Record.findByIdAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect(`/`))
    .catch((err) => console.log(err));
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
