const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { storeReturnTo } = require("../Middleware");

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.get("/login", (req, res) => {
  res.render("users/login");
});
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    return res.redirect("/campgrounds");
  });
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registerUser = await User.register(user, password);
      req.login(registerUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome To Trek-Venture");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);

router.post(
  "/login", storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    req.flash("success", "Welcome Back!");
    res.redirect(redirectUrl);
  }
);

module.exports = router;
