// import mongoose from mongoose libary
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://dhanashrirandive06:dhanashrirandive06@cluster0.3aflopl.mongodb.net/"
);
const db = mongoose.connection;

// printing error if any error occurred while connecting with database
db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

// connect to db
db.once("open", () => {
  console.log("Connected to Mongodb ");
});

// export db
module.exports = db;
