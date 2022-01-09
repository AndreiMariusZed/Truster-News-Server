const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  categoryID: { type: Schema.Types.ObjectId, ref: "Category" },
  authorID: { type: Schema.Types.ObjectId, ref: "Author" },
  title: String,
  content: String,
  photo: String,
  duration: String,
  description: String,
});

ArticleSchema.plugin(deepPopulate);

module.exports = mongoose.model("Article", ArticleSchema);
