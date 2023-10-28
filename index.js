const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

const port = 8000;
const db = require("./config/mongoose");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("./assets"));
app.use(expressLayouts);

//set up view Engine
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "user",
    secret: "THIS_IS_KEY",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl:
          "mongodb+srv://dhanashrirandive06:dhanashrirandive06@cluster0.3aflopl.mongodb.net/",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongo setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash)

app.use(require("./routes/routes"));
app.listen(port, (error) => {
  if (error) {
    console.log(`Error in Running Server on port : ${port}`);
  }
  console.log("Server Running on Port : ", port);
});
