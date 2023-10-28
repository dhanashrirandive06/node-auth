const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const fetch = require("node-fetch");
const userRegister_mailer = require("../mailers/userRegister_mailer");

//Render Home Page
module.exports.home = async (req, res) => {
  try {
    return res.render("home", {
      title: "Home",
    });
  } catch (error) {
    req.flash("error", "Error in user login");
    console.log("Error in user controller login", error);
    return;
  }
};

//Render Register Page
module.exports.register = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  return res.render("register", {
    title: "Register",
  });
};

//Render Login Page
module.exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }

  return res.render("login", {
    title: "Login",
  });
};

//Render reset Password Page
module.exports.resetPassword = (req, res) => {
  return res.render("resetPassword", {
    title: "Reset Password",
  });
};

//Create User (User Registration)
module.exports.create = async (req, res, next) => {
  try {
    if (req.body.password != req.body.confirmPassword) {
      req.flash("error", "Password Doesn't Match");
      return res.redirect("back");
    }

    if (req.body["g-recaptcha-response"].length === 0) {
      req.flash("error", "Enter Recaptcha first");
      return res.redirect("back");
    }

    //Verify Captach is valid or not
    const verifyCaptcha = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=6Le0pc8oAAAAAKc3ERemaC63ofuoQiM5_Mz_c4_l&response=${req.body["g-recaptcha-response"]}`,
      {
        method: "POST",
      }
    ).then((res) => res.json());

    if (verifyCaptcha.success !== true) {
      req.flash("error", "Please Enter Captcha Again");
      return res.redirect("back");
    }

    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      let newUser = User({
        email: req.body.email,
      });

      //Encrpt password using bcryptjs and store in database
      bcryptjs.hash(req.body.password, 10, (err, hashPassword) => {
        newUser.set("password", hashPassword);
        newUser.save();
        next();
      });

      //call mailer function to send mail to notify user about successful registration
      userRegister_mailer.newUserRegister(newUser);
      req.flash("success", "User Register Successfully");
      return res.redirect("/login");
    } else {
      console.log("User exist");
      req.flash("Error", "User already Exist");
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", "Error in user controller create");
    console.log("Error in user controller create", error);
    return;
  }
};

//create login session
module.exports.createSession = (req, res) => {
  req.flash("success", "Login Successfully");
  return res.redirect("/home");
};

//Reset Password
module.exports.createNewPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (req.body.password == req.body.newPassword) {
      req.flash(
        "error",
        "New Password Should not be same as Previous Password"
      );
      //console.log("New Password Should not be same as Previous Password");
      return res.redirect("/resetPassword");
    } else if (await bcryptjs.compare(req.body.password, user.password)) {
      bcryptjs.hash(req.body.newPassword, 10, (err, hashPassword) => {
        user.set("password", hashPassword);
        user.save();
        next();
      });
      req.flash("success", "Password Reset Successfully");
      console.log("Password Reset Successfully");
      return res.redirect("/home");
    } else {
      req.flash("error", "Old password not match.");
      return res.redirect("/resetPassword");
    }
  } catch (err) {
    req.flash("error", "Error in user controller Reset Password");
    console.log("Error in user controller Reset Password", err);
    return;
  }
};

//Logout functionaliy
module.exports.logout = (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);

    req.flash("success", "Logout Successfully");
    res.redirect("/login");
  });
};
