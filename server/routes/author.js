const router = require("express").Router();
const Author = require("../models/Author");
const Article = require("../models/article");
const User = require("../models/user");
//POST - Create a new author
router.post("/authors", async (req, res) => {
  try {
    let author = new Author();
    author.userID = req.body.id;
    author.balance = req.body.balance;
    author.trust = req.body.trust;
    let user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { isAuthor: true } }
    );
    await author.save();
    if (user) {
      res.json({ success: true, message: "Successfully saved author" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// GET - get all authors
router.get("/authors", async (req, res) => {
  try {
    let authors = await Author.find().populate("userID").exec();
    res.json({
      success: true,
      authors: authors,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get a single author
router.get("/authors/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let author = await Author.findOne({ userID: req.params.id })
      .populate("userID")
      .exec();
    res.json({
      success: true,
      author: author,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/authorsdetail/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let author = await Author.findOne({ _id: req.params.id })
      .populate("userID")
      .exec();
    let articles = await Article.find({ authorID: req.params.id })
      .deepPopulate("categoryID authorID.userID")
      .exec();
    res.json({
      success: true,
      author: author,
      articles: articles,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE AN AUTHOR
router.delete("/authors", async (req, res) => {
  try {
    let userID = await Author.findOne({ _id: req.body.id }, "userID").exec();
    let deletedAuthor = await Author.findOneAndDelete({ _id: req.body.id });
    let user = await User.findOneAndUpdate(
      { _id: userID.userID },
      { $set: { isAuthor: false } }
    );
    if (deletedAuthor && user) {
      res.json({
        success: true,
        message: "Successfuly deleted author",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
