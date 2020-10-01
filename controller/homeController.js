const { customers, team, services, isOdd } = require("../helpers/helpers");

exports.getHomePage = (req, res) => {
  res.status(200).render("index", { customers });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    title: "We are Monarchy",
    subtitle: "A full-service creative agency that turns brands into media.",
    videoUrl: "https://player.vimeo.com/video/462169205",
    team,
  });
};

exports.getServicesPage = (req, res) => {
  res.status(200).render("service", {
    title: "Full Service Marketing Engine",
    subtitle:
      "We are built for the now. Delivering retention, leads, and sales.",
    services,
    isOdd,
  });
};
