const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const Schema = mongoose.Schema;
const mongooseAlgolia = require("mongoose-algolia");

const ArticleSchema = new Schema(
  {
    categoryID: { type: Schema.Types.ObjectId, ref: "Category" },
    authorID: { type: Schema.Types.ObjectId, ref: "Author" },
    title: String,
    content: String,
    photo: String,
    duration: String,
    description: String,
    views: Number,
    trustworthy: Number,
    comments: [Object],
  },
  { timestamps: true }
);

ArticleSchema.plugin(deepPopulate);
ArticleSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SECRET,
  indexName: process.env.ALGOLIA_INDEX,

  selector: "title _id photo description content duration authorID categoryID",
  populate: {
    path: "authorID categoryID",
  },
  debug: true,
});

let Model = mongoose.model("Article", ArticleSchema);

Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  searchableAttributes: ["title"],
});
module.exports = Model;
