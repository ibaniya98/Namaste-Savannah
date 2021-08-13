const express = require("express"),
  passport = require("passport");
const Config = require("../db/models/config");

const middleWare = require("../middleware");
const { getAuthUrl, getNewToken } = require("../google/client");

const router = express.Router();

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("success", "You are already logged in");
    res.redirect("/menu");
  } else {
    res.render("admin/login", { redirectUrl: req.query.redirectUrl });
  }
});

router.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash(
        "error",
        "Login in temporarily not available, please try again later"
      );
      res.redirect("back");
    } else if (!user) {
      req.flash("error", "Invalid username or password");
      let requestedUrl = encodeURIComponent(req.body.redirectUrl || "/menu");
      res.redirect("/login?redirectUrl=" + requestedUrl);
    } else {
      req.login(user, (err) => {
        if (err) {
          req.flash(
            "error",
            "Login in temporarily not available, please try again later"
          );
          res.redirect("back");
        } else {
          res.redirect(req.body.redirectUrl || "/menu");
        }
      });
    }
  })(req, res);
});

// router.get('/register', (req, res) => {
//     res.render('admin/register');
// });

// router.post('/register', (req, res) => {
// 	var newUser = new User({
// 		username: req.body.username,
//         email: req.body.email,
//         isAdmin: true
// 	});

// 	User.register(newUser, req.body.password, (err, user) => {
// 		if (err) {
// 			console.log(err);
// 			req.flash('error', err.message);
// 			res.redirect('/register');
// 		} else {
// 			console.log(user);
// 			req.flash('success', 'Welcome ' + user.username);
// 			passport.authenticate('local')(req, res, () => {
// 				res.redirect('/menu');
// 			});
// 		}
// 	});
// });

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/login");
});

router.get("/token", (req, res) => {
  Config.findOne({ key: "emailToken" }, (err, doc) => {
    if (err) {
      return res.status(500).json(err);
    }
    console.log("No error yet");
    return res.status(200).json(doc);
  });
});

router.get(
  "/admin/google/reset-email-token",
  middleWare.isAuthorized,
  async (req, res) => {
    const authUrl = await getAuthUrl();
    res.redirect(authUrl);
  }
);

router.get("/admin/google/token", middleWare.isAuthorized, async (req, res) => {
  const { code } = req.query;
  if (code) {
    try {
      await getNewToken(code);
    } catch (err) {
      console.error(err);
      return res.redirect("/error");
    }
  }
  return res.redirect("/");
});

module.exports = router;
