const nodeMailer = require("../config/nodemailer");

//thsi is another way of exporting method

exports.newUserRegister = (user) => {
  let htmlString = nodeMailer.renderTemplate(
    { user: user },
    "/userRegister.ejs"
  );

  nodeMailer.transporter.sendMail(
    {
      from: "cn.ninja0623@gmail.com",
      to: user.email,
      subject: "Registration Completed Successfully",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      console.log("Mail delivered", info);
      return;
    }
  );
};
