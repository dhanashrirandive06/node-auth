const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const fetch = require("node-fetch");

//Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      //Find User and establish the identity
      if (req.body["g-recaptcha-response"].length === 0) {
        req.flash("error", "Enter Recaptcha first");
        return done(null, false);
      }

      const verifyCaptcha = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=6Le0pc8oAAAAAKc3ERemaC63ofuoQiM5_Mz_c4_l&response=${req.body["g-recaptcha-response"]}`,
        {
          method: "POST",
        }
      ).then((res) => res.json());

      if (verifyCaptcha.success !== true) {
        req.flash("error", "Please Enter Captcha Again");
        return done(null, false);
      }

      User.findOne({ email: email })
        .then(async function (user) {
          const validate = await bcryptjs.compare(password, user.password);
          if (!user || validate != true) {
            console.log("Invalid Username/Password");
            //req.flash('error',"Invalid Username/Password");
            return done(null, false);
          }

          return done(null, user);
        })
        .catch(function (err) {
          console.log("Error Finding User");
          //req.flash('error', err)
          return done(err);
        });
    }
  )
);

//Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

//Deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then(function (user) {
      return done(null, user);
    })
    .catch(function (err) {
      console.log("Error in finding user ---> passport");
      return done(err);
    });
});

//Check if user is authenticated or not
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
