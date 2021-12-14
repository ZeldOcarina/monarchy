const {
  customers,
  team,
  services,
  clientsPageCustomers,
  logos,
  homeGrid,
  isOdd,
} = require("../helpers/helpers");

exports.getHomePage = (req, res) => {
  res.status(200).render("index", { customers, homeGrid });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    title: "We are Monarchy",
    subtitle:
      "A full service marketing engine that generates attention, leads and sales.",
    videoUrl: "https://player.vimeo.com/video/656611333",
    team,
  });
};

exports.getServicesPage = (req, res) => {
  res.status(200).render("service", {
    title: "A Full Service Marketing Engine",
    subtitle:
      "We partner with innovative businesses to generate attention, leads and sales.",
    services,
    isOdd,
    logos,
  });
};

exports.getClientsPage = (req, res) => {
  res.status(200).render("clients", {
    title: "Our Partnerships",
    subtitle:
      "We strive to surpass business goals and targets. We are selective in the businesses we take on and look forward to growing together.",
    clientsPageCustomers,
  });
};
