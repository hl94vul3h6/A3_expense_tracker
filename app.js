// 載入 express 並建構應用程式伺服器
const express = require("express");
const exphbs = require("express-handlebars");
const Record = require('./models/record')
const bodyParser = require("body-parser")
const methodOverride = require('method-override')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require("./routes");

require('./config/mongoose')

const app = express();

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(routes)

// 設定 port 3000
app.listen(3000, () => {
  console.log("App is running on http://localhost:3000");
});
