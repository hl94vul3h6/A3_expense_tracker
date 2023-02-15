const mongoose = require("mongoose");
const Record = require("../record"); 
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongodb connected!");
  for (let i = 0; i < 10; i++) {
    Record.create({ name: `name-${i}`, date: `1997/09/24`, amount: `10000`});
  }
  console.log("done");
});
