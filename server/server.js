const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const User = require("./models/user");

dotenv.config();

const app = express();
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to the Database");
    }
  }
);
//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//require apis
const articleRoutes = require("./routes/article");
const categoryRoutes = require("./routes/category");
const authorRoutes = require("./routes/author");
const userRoutes = require("./routes/auth");

app.use("/api", articleRoutes);
app.use("/api", categoryRoutes);
app.use("/api", authorRoutes);
app.use("/api", userRoutes);

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on PORT", 3000);
  }
});
