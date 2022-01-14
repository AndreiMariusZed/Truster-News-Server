const router = require("express").Router();
const Article = require("../models/article");
const upload = require("../middlewares/upload-photo");
const NewsAPI = require("newsapi");
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

    await article.save();
    res.json({ success: true, message: "Successfully saved article" });
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
//PUT - UPDATE A SINGLE PRODUCT
router.put("/articles/:id", upload.single("photo"), async (req, res) => {
  try {
    let article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          categoryID: req.body.categoryID,
          content: req.body.content,
          photo: req.file.location,
        },
      },
      { upsert: true }
    );
    res.json({
      success: true,
      updatedArticle: article,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
//DELETE - DELETE A SINGLE PRODUCT
router.delete("/articles/:id", async (req, res) => {
  try {
    let deletedArticle = await Article.findOneAndDelete({ _id: req.params.id });

    if (deletedArticle) {
      res.json({
        status: true,
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
module.exports = router;
