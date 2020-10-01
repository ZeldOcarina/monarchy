const fs = require("fs");
const path = require("path");

function parseJSON(path) {
  return JSON.parse(fs.readFileSync(path), {
    encoding: "utf-8",
  });
}

exports.customers = parseJSON(
  path.join(__dirname, "../content/customers.json")
);
exports.team = parseJSON(path.join(__dirname, "../content/team.json"));
exports.services = parseJSON(path.join(__dirname, "../content/services.json"));
exports.clientsPageCustomers = parseJSON(
  path.join(__dirname, "../content/clientsPageCustomers.json")
);

exports.isOdd = function (number) {
  return number % 2 !== 0;
};
