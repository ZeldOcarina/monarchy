const crypto = require("crypto");
const replaceAll = require("string.prototype.replaceall");

const transporter = require("../config/nodemailer-setup");

function hashData(datum) {
  return crypto.createHash("sha256").update(datum).digest("hex");
}

exports.hashData = hashData;

exports.setupPhone = function (str) {
  if (!str) return undefined;
  const firstStep = str.trim().replace("+", "");

  const secondStep = replaceAll(firstStep, "-", "");
  const cleanPhoneNumber = replaceAll(secondStep, " ", "");
  return hashData(cleanPhoneNumber);
};

exports.handleConversionAPIError = async function (err) {
  const message = {
    from: "info@monarchy.io",
    //to: 'nicole@monarchy.io',
    to: "mattia@monarchy.io",
    subject:
      "We have an error on the Body Contourz LEAD FB API Conversions setup.",
    html: `<p>Here is the error we are having:</p><p>${err.stack}</p>`,
  };

  await transporter.sendMail(message);
  console.log(err);
};
