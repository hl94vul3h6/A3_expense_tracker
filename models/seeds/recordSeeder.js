const bcrypt = require('bcryptjs')
const Record = require("../record"); 
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const db = require("../../config/mongoose");
const User = require("../user");
const SEED_USER = {
  name: "root",
  email: "root@example.com",
  password: "12345678",
};
// db.once("open", () => {
//   console.log("mongodb connected!");
//   for (let i = 0; i < 10; i++) {
//     Record.create({ name: `name-${i}`, date: `1997/09/24`, amount: `10000`});
//   }
//   console.log("done");
// });

db.once("open", () => {
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(SEED_USER.password, salt))
    .then((hash) =>
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash,
      })
    )
    .then((user) => {
      const userId = user._id;
      return Promise.all(Array.from(
        { length: 10 },
        (_, i) => Record.create({
          name: `name-${i}`,
          userId,
          date: `1997/09/24`,
          amount: `10000`,
        })
      ))
    })
    .then(() => {
      console.log("done.");
      process.exit();
    });
});
