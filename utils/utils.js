const crypto = require("crypto");
const replaceAll = require("string.prototype.replaceall");

function hashData(datum) {
  return crypto.createHash("sha256").update(datum).digest("hex");
}

module.exports = {
  getTimestamp() {
    return Math.floor(new Date() / 1000);
  },
  hashData,
  setupPhone(str) {
    const firstStep = str.trim().replace("+", "");
    const secondStep = replaceAll(firstStep, "-", "");
    const cleanPhoneNumber = replaceAll(secondStep, " ", "");
    return hashData(cleanPhoneNumber);
  },
};
