const router = require("express").Router();
const Application = require("../models/application");
const upload = require("../middlewares/upload-photo");

//POST APPLICATION
const cpUpload = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "cv", maxCount: 1 },
]);
router.post("/applications", cpUpload, async (req, res) => {
  try {
    let application = new Application();
    application.userID = req.body.userID;
    application.title = req.body.title;
    application.content = req.body.content;
    application.photo = req.files["photo"][0].location;
    application.description = req.body.description;
    application.status = "pending";
    application.cv = req.files["cv"][0].location;

    await application.save();
    res.json({ success: true, message: "Successfully saved application" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//GET ALL APPLICATIONS

router.get("/applications", async (req, res) => {
  try {
    let applications = await Application.find().populate("userID").exec();
    res.json({
      success: true,
      applications: applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get a single application
router.get("/applications/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let application = await Application.findOne({ _id: req.params.id })
      .populate("userID")
      .exec();
    res.json({
      success: true,
      application: application,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//delete a application
router.delete("/applications/:id", async (req, res) => {
  try {
    let deletedApplication = await Application.findOneAndDelete({
      _id: req.params.id,
    });

    if (deletedApplication) {
      res.json({
        success: true,
        message: "Successfully deleted application",
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
