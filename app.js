require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const favicon = require("serve-favicon");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const helmet = require("helmet");
const expressSanitizer = require("express-sanitizer");
const cors = require("cors");

const User = require("./models/users");

let appState =
  process.env.NODE_ENV === "production" ? "production" : "development";

//INCLUDING PERSONAL MODULES
const limiter = require("./config/security");

//REQUIRING ROUTES
const apiRoute = require("./routes/apiRoute");
const authenticationRoute = require("./routes/authenticationRoute");
const homeRoute = require("./routes/homeRoute");
const blogRoute = require("./routes/blogRoute");
const contactsRoute = require("./routes/contactsRoute");

const app = express();

app.use(morgan(appState === "development" ? "dev" : "combined"));

// SECURITY
app.use(cors());
app.use(helmet());
app.use(expressSanitizer());

app.use(favicon(path.join(__dirname, "public", "assets/favicon.svg")));
if (appState === "production") app.use(helmet());
if (appState === "production") app.use(limiter);
app.set("view engine", "ejs");
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 7000 /* UNA SETTIMANA */ },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      autoRemove: "native",
      //autoRemoveInterval: 60,
      //touchAfter: 24 * 3600
    }),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//GLOBAL TEMPLATES VARIABLES
app.locals = {
  ...app.locals,
  publicKey: process.env.RECAPTCHA_PUBLIC_KEY,
  title: "",
  subtitle: "",
  videoUrl: "",
  message: {},
  tinyMCEKey: "",
  isBlogShowPage: false,
};

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.user = req.user ? req.user : null;
  next();
});

//TEST MIDDLEWARE
app.use((req, res, next) => {
  next();
});

//HOME PAGE
app.use("/", homeRoute);
app.use("/api/v1", apiRoute);
app.use("/authentication", authenticationRoute);
app.use("/blog", blogRoute);
app.use("/contacts", contactsRoute);

//404
app.all("*", (req, res, next) => {
  res.status(404).send("The required page does not exist on this server!");
});

exports.app = app;
exports.appState = appState;
