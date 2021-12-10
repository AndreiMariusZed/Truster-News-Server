const express = require("express");
const morgan = require("morgan");

const app = express();

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json("merge");
});

app.post("/", (req, res) => {
  console.log(req.body.name);
});

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on PORT", 3000);
  }
});
