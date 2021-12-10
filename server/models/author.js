const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  balance: Number,
});

module.exports = mongoose.model("Author", AuthorSchema);
