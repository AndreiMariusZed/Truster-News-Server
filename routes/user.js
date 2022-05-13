const router = require("express").Router();
const User = require("../models/user");
const mongoose = require("mongoose");
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
    let articleID = mongoose.Types.ObjectId(req.body.articleID);
    let foundUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $addToSet: {
          bookmarkedArticles: articleID,
        },
      }
    );
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

//remove from bookmark
router.delete("/removebookmark/:id", async (req, res) => {
  try {
    let articleID = mongoose.Types.ObjectId(req.body.id);
    let foundUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          bookmarkedArticles: articleID,
        },
      }
    );
    if (foundUser) {
      res.json({
        success: true,
        message: "Successfully deleted article",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//add to recenlty viewed
router.put("/addrecently/:id", verifyToken, async (req, res) => {
  try {
    let articleID = mongoose.Types.ObjectId(req.body.articleID);
    let foundUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $addToSet: {
          recentlyViewed: articleID,
        },
      }
    );
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

//get recently viewed
router.get("/recentlyviewed", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id })
      .deepPopulate(
        "recentlyViewed recentlyViewed.categoryID recentlyViewed.authorID.userID"
      )
      .exec();
    let recentlyViewed = foundUser.recentlyViewed;
    res.json({
      success: true,
      recentlyViewed: recentlyViewed,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
