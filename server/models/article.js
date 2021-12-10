const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  categoryID: { type: Schema.Types.ObjectId, ref: "Category" },
  authorID: { type: Schema.Types.ObjectId, ref: "Author" },
  title: String,
  content: String,
  photo: String,
});

module.exports = mongoose.model("Article", ArticleSchema);
