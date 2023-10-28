const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/UserController");

router.get("/", UserController.register);
router.get("/login", UserController.login);
router.get("/home", passport.checkAuthentication, UserController.home);
router.get("/forgotpassword", UserController.forgotpassword);
router.get("/resetPassword", UserController.resetPassword);
router.get("/logout", UserController.logout);

//post methods
router.post("/create", UserController.create);
router.post("/createNewPassword", UserController.createNewPassword);

//use passport as a middleware
router.post(
  "/createSession",
  passport.authenticate("local", { failureRedirect: "/login" }),
  UserController.createSession
);
// router.post("/reset", UserController.reset);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  UserController.createSession
);

module.exports = router;
