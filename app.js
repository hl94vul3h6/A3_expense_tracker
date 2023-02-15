// 載入 express 並建構應用程式伺服器
const express = require("express");
const mongoose = require("mongoose")
const exphbs = require("express-handlebars");
const Record = require('./models/record')
const bodyParser = require("body-parser")
const methodOverride = require('method-override')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

// 設定首頁路由
app.get("/", (req, res) => {
  Record.find()
    .lean()
    .sort({ _id: "asc" })
    .then((records) => res.render("index", { records }))
    .catch((error) => console.error(error)); 
});

//拿New樣板
app.get("/records/new", (req, res) => {
  return res.render("new");
});

//接住表單資料 Create
app.post("/records", (req, res) => {
  Record.create(req.body) //存入資料庫
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error))
});

//編輯資料
app.get("/records/:id/edit", (req, res) => {
  const id = req.params.id;
  return Record.findById(id)
    .lean()
    .then((record) => res.render("edit", { record }))
    .catch((error) => console.log(error));
});

//接住資料送往資料庫
app.put("/records/:id", (req, res) => {
  const recordId = req.params.id;
  console.log(req.body)
  Record.findByIdAndUpdate(recordId, req.body)
    .then(() => res.redirect(`/`))
    .catch((err) => console.log(err));
});

//刪除
app.delete("/records/:id", (req, res) => {
  const id = req.params.id;
  return Record.findById(id)
    .then((record) => record.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

// 設定 port 3000
app.listen(3000, () => {
  console.log("App is running on http://localhost:3000");
});
