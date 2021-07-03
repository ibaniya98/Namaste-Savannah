require("dotenv").config();

let express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  User = require("./models/user"),
  passport = require("passport"),
  LocalStrategy = require("passport-local");

// <<<<<<<<<<<<<< Database Setup >>>>>>>>>>>>>>>>>
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(console.log("Connected to the database"))
  .catch((err) => console.log(err));

// <<<<<<<<<<< Express Setup >>>>>>>>>>>
let app = express();
app.set("view engine", "ejs");
app.use(express.static("public", { maxAge: "1d" }));
app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
app.use(flash());
app.use(methodOverride("_method"));

// <<<<<<<< Passport Configuration >>>>>>>>>
app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
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
let menuRoutes = require("./routes/menu"),
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
