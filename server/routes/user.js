const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verify-token");

// GET - get all users

router.get("/users", async (req, res) => {
  try {
    let users = await User.find({ isAuthor: false });
    res.json({
      success: true,
      users: users,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//get a single user

router.get("/users/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let author = await User.findOne({ _id: req.params.id });
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

//add to bookmark
router.put("/addbookmark/:id", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params.id);
    let articleID = mongoose.Types.ObjectId(req.body.articleID);
    let foundUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          bookmarkedArticles: articleID,
        },
      }
    );
    console.log(foundUser);
    if (foundUser) {
      res.json({
        success: true,
        message: "Successfully added article",
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
