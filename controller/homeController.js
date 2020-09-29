const fs = require("fs");
const path = require("path");

const customers = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../content/customers.json"), {
    encoding: "utf-8",
  })
);

exports.getHomePage = (req, res) => {
  res.status(200).render("index", { customers });
};

exports.getAboutPage = (req, res) => {
  res
    .status(200)
    .render("about", {
      title: "We are Monarchy",
      subtitle: "A full-service creative agency that turns brands into media.",
    });
};
