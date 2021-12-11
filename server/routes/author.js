const router = require("express").Router();
const Author = require("../models/Author");
//POST - Create a new author
router.post("/authors", async (req, res) => {
  try {
    let author = new Author();
    author.userID = req.body.id;
    author.balance = req.body.balance;

    await author.save();

    res.json({ success: true, message: "Successfully saved author" });
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

module.exports = router;
