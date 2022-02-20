const router = require("express").Router();
const Article = require("../models/article");
const upload = require("../middlewares/upload-photo");
const NewsAPI = require("newsapi");
const Category = require("../models/category");
const newsapi = new NewsAPI(process.env.NEWSAPI);
//POST -CREATE A NEW ARTICLE
router.post("/articles", upload.single("photo"), async (req, res) => {
  try {
    let article = new Article();
    article.authorID = req.body.authorID;
    article.categoryID = req.body.categoryID;
    article.title = req.body.title;
    article.content = req.body.content;
    article.photo = req.file.location;
    article.duration = req.body.duration;
    article.description = req.body.description;
    article.views = 0;

    let articleTextAndTitle = req.body.title + " " + req.body.wholeText;

    var spawn = require("child_process").spawn;
    var process = spawn("python", [
      "D:/licenta/server/ai/predict.py",
      articleTextAndTitle,
    ]);
    // console.log(process);
    process.stdout.on("data", async function (data) {
      // console.log(data.toString().replace(/(\r\n|\n|\r)/gm, ""));
      const response = data.toString().replace(/(\r\n|\n|\r)/gm, "");
      console.log(response);
      if (response === "True") {
        console.log("e adv");
        await article.save();
        res.json({
          success: true,
          message: "Successfully saved article",
          article: article,
        });
      } else {
        console.log("nu e adv");
        res.json({ success: false, message: "Fake news!" });
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//GET - GET ALL ARTICLES
router.get("/articles", async (req, res) => {
  try {
    let articles = await Article.find()
      .deepPopulate("categoryID authorID.userID")
      .exec();
    res.json({
      success: true,
      articles: articles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//GET - GET ALL ARTICLES BY CATEGORY
router.get("/articlesbycategory/:categoryID", async (req, res) => {
  try {
    let articles = await Article.find({ categoryID: req.params.categoryID })
      .deepPopulate("categoryID authorID.userID")
      .exec();
    res.json({
      success: true,
      articles: articles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//GET - GET A SINGLE ARTICLE
router.get("/articles/:id", async (req, res) => {
  try {
    let article = await Article.findOne({ _id: req.params.id })
      .deepPopulate("categoryID authorID.userID")
      .exec();
    res.json({
      success: true,
      article: article,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
//PUT - UPDATE A SINGLE Article
router.put("/articles/:id", upload.single("photo"), async (req, res) => {
  try {
    let articleTextAndTitle = req.body.title + " " + req.body.wholeText;
    var spawn = require("child_process").spawn;
    var process = spawn("python", [
      "D:/licenta/server/ai/predict.py",
      articleTextAndTitle,
    ]);
    process.stdout.on("data", async function (data) {
      const response = data.toString().replace(/(\r\n|\n|\r)/gm, "");
      console.log(response);
      if (response === "True") {
        let foundArticle = await Article.findOne({ _id: req.params.id });
        if (foundArticle) {
          if (req.body.title) foundArticle.title = req.body.title;
          if (req.body.categoryID)
            foundArticle.categoryID = req.body.categoryID;
          if (req.body.content) foundArticle.content = req.body.content;
          if (req.file && req.file.location)
            foundArticle.photo = req.file.location;
          if (req.body.description)
            foundArticle.description = req.body.description;
          if (req.body.duration) foundArticle.duration = req.body.duration;
          await foundArticle.save();
          res.json({
            success: true,
            updatedArticle: foundArticle,
          });
        }
        // let article = await Article.findOneAndUpdate(
        //   { _id: req.params.id },
        //   {
        //     $set: {
        //       title: req.body.title,
        //       categoryID: req.body.categoryID,
        //       content: req.body.content,
        //       photo: req.file.location,
        //       description: req.body.description,
        //       duration: req.body.duration,
        //     },
        //   },
        //   { upsert: true }
        // );
      } else {
        console.log("nu e adv");
        res.json({ success: false, message: "Fake news!" });
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
//DELETE - DELETE A SINGLE ARTICLE
router.delete("/articles/:id", async (req, res) => {
  try {
    let deletedArticle = await Article.findOneAndDelete({ _id: req.params.id });

    if (deletedArticle) {
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

//VIEW AN ARTICLE
router.put("/viewarticle/:id", async (req, res) => {
  try {
    let foundArticle = await Article.findOne({ _id: req.params.id });
    if (foundArticle) {
      if (req.body.views) foundArticle.views = req.body.views;
      await foundArticle.save();
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

router.get("/topnews", async (req, res) => {
  try {
    newsapi.v2
      .topHeadlines({
        country: "ro",
      })
      .then((response) => {
        res.json({
          success: true,
          topnews: response,
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
//INSERT COMMENT

router.put("/addcomment/:id", async (req, res) => {
  try {
    console.log(req.body);
    let foundArticle = await Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          comments: req.body,
        },
      }
    );
    console.log(foundArticle);
    if (foundArticle) {
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
//CHECK URL
router.post("/checkurl", async (req, res) => {
  try {
    const url = req.body.url;
    var spawn = require("child_process").spawn;
    var process = spawn("python", ["D:/licenta/server/ai/scrape.py", url]);
    process.stdout.on("data", async function (data) {
      const result = data.toString().replace(/(\r\n|\n|\r)/gm, "");
      res.json({
        success: true,
        message: "Successfully checked article",
        result: result,
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;
