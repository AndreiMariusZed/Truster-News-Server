const router = require("express").Router();
const Eval = require("../models/eval");

router.get("/eval/:uid", async (req, res) => {
    try {
      let eval = await Eval.findOne({ uid: req.params.uid });
      console.log(req.params)
      res.json({
        success: true,
        eval: eval,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  });

module.exports = router;
