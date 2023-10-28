const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

// Passport google Strategy
passport.use(
  new googleStrategy(
    {
      clientID:
        "1001690896634-83c8jon939928m5e2si1aimbqb0j1mo6.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/auth/google/callback",
    },

    function (accessToken, refreshToken, profile, done) {
      //find the user
      User.findOne({ email: profile.emails[0].value })
        .then(function (user) {
          // console.log(profile);
          if (user) {
            // if found set this user as req.user
            return done(null, user);
          } else {
            //if not found create the user and set it as req.user
            User.create({
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            })
              .then((user) => {
                return done(null, user);
              })
              .catch((err) => {
                console.log(
                  "Error creating new user google-strategy passport",
                  err
                );
                return;
              });
          }
        })
        .catch((err) => {
          console.log("Error in google-strategy passport", err);
          return;
        });
    }
  )
);
