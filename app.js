// 載入 express 並建構應用程式伺服器
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const Record = require('./models/record')
const bodyParser = require("body-parser")
const methodOverride = require('method-override')
const flash = require("connect-flash");

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require("./routes");

const usePassport = require("./config/passport");

require('./config/mongoose')

const app = express();

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

usePassport(app);

app.use(flash());

app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg"); 
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

app.use(routes)

// 設定 port 3000
app.listen(process.env.PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
