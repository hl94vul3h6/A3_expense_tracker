const express = require("express");
const router = express.Router();
const Record = require("../../models/record");

// 設定首頁路由
router.get("/", (req, res) => {
  const userId = req.user._id;
  Record.find({ userId })
    .lean()
    .sort({ _id: "asc" })
    .then((records) => res.render("index", { records }))
    .catch((error) => console.error(error)); 
});

module.exports = router;