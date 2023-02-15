const Record = require("../record"); 
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const db = require("../../config/mongoose");

db.once("open", () => {
  console.log("mongodb connected!");
  for (let i = 0; i < 10; i++) {
    Record.create({ name: `name-${i}`, date: `1997/09/24`, amount: `10000`});
  }
  console.log("done");
});
