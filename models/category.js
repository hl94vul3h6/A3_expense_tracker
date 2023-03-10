const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: String,
  categoryName: String,
  icon: String
});

module.exports = mongoose.model("Category", categorySchema);
