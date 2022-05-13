const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EvalSchema = new Schema({
  uid: String,
  result: String,
});

module.exports = mongoose.model("Eval", EvalSchema);
