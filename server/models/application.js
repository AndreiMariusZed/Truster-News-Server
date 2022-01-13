const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  content: String,
  photo: String,
  description: String,
  status: String,
  cv: String,
});

ApplicationSchema.plugin(deepPopulate);

module.exports = mongoose.model("Application", ApplicationSchema);
