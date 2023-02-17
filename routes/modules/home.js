const express = require("express");
const router = express.Router();
const Record = require("../../models/record");
const Category = require("../../models/category");

// 在記帳資料上加上分類資訊及日期轉換
function addCategoryInfo(records, categories) {
  const newRecord = records.map((record) => {
    record.date = record.date.toISOString().slice(0, 10);
    const targetCategory = getCategoryInfoById(record.categoryId.toString(), categories)
    return {
      ...record,
      icon: targetCategory.icon
    }
  })

  return newRecord
}
// 計算金額總和
function sumRecordsAmount(records) {
  let totalAmount = 0

  records.forEach((r) => {
    totalAmount = totalAmount + r.amount
  })

  return totalAmount
}
// 返回對應的分類資料
function getCategoryInfoById(categoryId, categories) {
  return categories.find((c) => {
    return c._id.toString() === categoryId
  })
}

// 設定首頁路由
router.get("/", (req, res) => {
  const userId = req.user._id;
  // 取得目前 category
  const currentCategoryId = req.query.currentCategoryId || "all";
  const searchConditions =
    currentCategoryId !== "all"
      ? {
          userId,
          categoryId: currentCategoryId,
        }
      : { userId };

  Promise.all([
    Category.find().lean().sort({ _id: "asc" }),
    Record.find(searchConditions).lean().sort({ date: "desc" }),
  ])
    .then((results) => {
      let records = results[1];
      let currentCategoryName, categories;
      // 顯示全部直接回傳完整紀錄
      if (currentCategoryId === "all") {
        categories = results[0];
      } else {
        // 取得對應分類名稱
        currentCategoryName = getCategoryInfoById(
          currentCategoryId,
          results[0]
        ).categoryName;
        // 去掉目前的選項
        categories = results[0].filter((item) => {
          return item._id.toString() !== currentCategoryId;
        });
      }

      return res.render("index", {
        categories,
        currentCategoryName,
        records: addCategoryInfo(records, results[0]),
        totalAmount: sumRecordsAmount(records),
      });
    })
    .catch((error) => console.log(error));
});

module.exports = router;