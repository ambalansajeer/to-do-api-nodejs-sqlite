var createError = require("http-errors");
var express = require("express");
var path = require("path");
const cors = require("cors");

var indexRouter = require("./routes/index");

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

module.exports = app;
