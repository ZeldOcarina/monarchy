const path = require("path");
require("dotenv").config();
const express = require("express");
const favicon = require("serve-favicon");
const helmet = require("helmet");
let reloadify;
if (process.env.NODE_ENV !== "production")
  reloadify = require("reloadify")(__dirname + "/public");

const morgan = require("morgan");

let appState =
  process.env.NODE_ENV === "production" ? "production" : "development";

//INCLUDING PERSONAL MODULES
const limiter = require("./config/security");

//REQUIRING ROUTES
const homeRoute = require("./routes/homeRoute");

const app = express();

app.use(morgan(appState === "development" ? "dev" : "combined"));

if (appState !== "production") app.use(reloadify);
app.use(favicon(path.join(__dirname, "public", "assets/favicon.svg")));
if (appState === "production") app.use(helmet());
if (appState === "production") app.use(limiter);
app.set("view engine", "ejs");
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

//GLOBAL TEMPLATES VARIABLES
app.locals = {
  ...app.locals,
  publicKey: process.env.RECAPTCHA_PUBLIC_KEY,
  title: "",
  subtitle: "",
  videoUrl: "",
};

//TEST MIDDLEWARE
app.use((req, res, next) => {
  next();
});

//HOME PAGE
app.use("/", homeRoute);

//404
app.all("*", (req, res, next) => {
  res.status(404).send("The required page does not exist on this server!");
});

exports.app = app;
exports.appState = appState;
