const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

// To send mail when User Register 
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "cn.ninja0623@gmail.com",
    pass: "ojma jedg ixek swwh",
  },
});

// To render template(Format) of Gmail
let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("Error in rendering template");
        return;
      }

      mailHTML = template;
    }
  );
  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
