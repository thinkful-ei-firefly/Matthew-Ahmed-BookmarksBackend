require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const app = express();
const bookmarks = require("./routes/bookmarks");

const morganOption = NODE_ENV === "production" ? "tiny" : "common";
//middleware
const validateBearerToken = require("./middleware/validateBearerToken");

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(validateBearerToken);

app.use("/bookmarks", bookmarks);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
