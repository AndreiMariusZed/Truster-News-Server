const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verify-token");

//Sign up
router.post("/auth/signup", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({
      success: false,
      message: "Please enter email and password",
    });
  } else {
    try {
      let newUser = new User();
      newUser.firstName = req.body.firstName;
      newUser.lastName = req.body.lastName;
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      newUser.password = req.body.password;
      newUser.isAuthor = false;
      await newUser.save();
      let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
        expiresIn: 604800, //1 week
      });

      res.json({
        success: true,
        token: token,
        message: "Successfully created a new user",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
});

// Profile Route

router.get("/auth/user", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id });
    if (foundUser) {
      res.json({
        success: true,
        user: {
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          username: foundUser.username,
          isAuthor: foundUser.isAuthor,
          _id: foundUser._id,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//login route

router.post("/auth/login", async (req, res) => {
  try {
    let foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      res.status(403).json({
        success: false,
        message: "Authentification failed, User not found",
      });
    } else {
      if (foundUser.comparePassword(req.body.password)) {
        let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
          expiresIn: 604800, //1 week
        });
        res.json({
          success: true,
          token: token,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Authentification failed, Wrong Password",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// UPDATE A PROFILE
router.put("/auth/user", verifyToken, async (req, res) => {
  try {
    let foundUser = await User.findOne({ _id: req.decoded._id });
    if (foundUser) {
      if (req.body.firstName) foundUser.firstName = req.body.firstName;
      if (req.body.lastName) foundUser.lastName = req.body.lastName;
      if (req.body.username) foundUser.username = req.body.username;
      if (req.body.password) foundUser.password = req.body.password;
      if (req.body.description) foundUser.description = req.body.description;
      await foundUser.save();
      res.json({
        success: true,
        message: "Successfully updated user",
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
