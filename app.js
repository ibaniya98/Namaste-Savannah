require("dotenv").config();

const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  User = require("./db/models/user"),
  passport = require("passport"),
  LocalStrategy = require("passport-local");

// <<<<<<<<<<<<<< Database Setup >>>>>>>>>>>>>>>>>

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => {
    console.error("Failed to connect to the database");
    console.error(err);
  });

mongoose.set("toJSON", {
  virtuals: true,
});

mongoose.set("toObject", {
  virtuals: true,
});

// <<<<<<<<<<< Express Setup >>>>>>>>>>>
const app = express();
const staticSettings = {};
if (process.env.NODE_ENV === "production") {
  staticSettings["maxAge"] = "1d";
}
app.set("view engine", "ejs");
app.use(express.static("public", staticSettings));
app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
app.use(methodOverride("_method"));

// Session Setup
app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// <<<<<<<< Passport Configuration >>>>>>>>>
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errorMsg = req.flash("error");
  res.locals.successMsg = req.flash("success");
  next();
});

// <<<<<<<<<<< Routes >>>>>>>>>>>>
const menuRoutes = require("./routes/menu"),
  adminRoutes = require("./routes/admin"),
  basicRoutes = require("./routes/index"),
  partnerRoutes = require("./routes/partners"),
  contactRoutes = require("./routes/contact"),
  apiRoutes = require("./routes/api"),
  photoRoutes = require("./routes/photos");

app.use([
  basicRoutes,
  menuRoutes,
  adminRoutes,
  partnerRoutes,
  contactRoutes,
  photoRoutes,
]);
app.use("/api", apiRoutes);

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/*", (req, res) => {
  res.render("404");
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Starting the server");
});
