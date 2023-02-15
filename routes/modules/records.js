const express = require("express");
const router = express.Router();
const Record = require("../../models/record");

//拿New樣板
router.get("/new", (req, res) => {
  return res.render("new");
});

//接住表單資料 Create
router.post("/", (req, res) => {
  Record.create(req.body) //存入資料庫
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error))
});

//編輯資料
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  return Record.findById(id)
    .lean()
    .then((record) => res.render("edit", { record }))
    .catch((error) => console.log(error));
});

//接住資料送往資料庫
router.put("/:id", (req, res) => {
  const recordId = req.params.id;
  Record.findByIdAndUpdate(recordId, req.body)
    .then(() => res.redirect(`/`))
    .catch((err) => console.log(err));
});

//刪除
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Record.findById(id)
    .then((record) => record.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
