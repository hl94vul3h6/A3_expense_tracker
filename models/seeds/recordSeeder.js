const bcrypt = require('bcryptjs')
const Record = require("../record"); 
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const db = require("../../config/mongoose");
const User = require("../user");
const Category = require('../category')
const SEED_USER = {
  name: "test",
  email: "test@test.com",
  password: "test",
};
const SEED_RECORD = [
  {
    name: "PS5",
    category: "entertainment",
    date: "2023-02-16",
    amount: 250,
  },
  {
    name: "The Last Of Us I",
    category: "entertainment",
    date: "2023-02-16",
    amount: 70,
  },
  {
    name: "Cyberpunk 2077",
    category: "entertainment",
    date: "2023-02-16",
    amount: 30,
  },
  {
    name: "GTA5",
    category: "entertainment",
    date: "2023-02-16",
    amount: 30,
  },
  {
    name: "Hogwarts Legacy",
    category: "entertainment",
    date: "2023-02-16",
    amount: 80,
  },
  {
    name: "Panda Express",
    category: "food",
    date: "2023-02-16",
    amount: 9,
  },
];

db.once("open", async () => {
  console.log('recordSeeder start.')
  const categories = await Category.find()
  const categoryIdMapping = categories.reduce((prev, curr) => {
    return {
      ...prev,
      [curr.category]: curr._id,
    }
  }, {})
  
  const user = await bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(SEED_USER.password, salt))
    .then((hash) =>
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash,
      })
    ); 
    Promise.all(SEED_RECORD.map((record) => {
      return Record.create({
        name: record.name,
        date: record.date,
        amount: record.amount,
        userId: user._id,
        categoryId: categoryIdMapping[record.category],
        });
    }))
    .then(() => {
      console.log("recordSeeder done.")
      db.close()
    })
    .catch(console.error)
    .finally(() => process.exit())
});
