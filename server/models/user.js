const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  description: String,
  isAuthor: Boolean,
  photo: String,
  bookmarkedArticles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  recentlyViewed: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  followedAuthors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
});

UserSchema.pre("save", function (next) {
  let user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.plugin(deepPopulate);

UserSchema.methods.comparePassword = function (password, next) {
  let user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model("User", UserSchema);
