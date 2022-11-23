const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else if (success) {
    console.log("Server is ready to take our messages");
  } else {
    console.log("Something went wrong");
  }
});

module.exports = transporter;
