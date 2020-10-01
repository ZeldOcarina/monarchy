const {
  customers,
  team,
  services,
  clientsPageCustomers,
  isOdd,
} = require("../helpers/helpers");

exports.getHomePage = (req, res) => {
  res.status(200).render("index", { customers });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    title: "We are Monarchy",
    subtitle: "A full-service creative agency that turns brands into media.",
    videoUrl: "https://player.vimeo.com/video/463782484",
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

exports.getClientsPage = (req, res) => {
  res.status(200).render("clients", {
    title: "Our Partners",
    subtitle: "We help  clients grow beyond what they thought was possible.",
    clientsPageCustomers,
  });
};

exports.getContactsPage = (req, res) => {
  res.status(200).render("contacts", {
    title: "Get in Touch",
    subtitle: "Tell us more about yourself and let's connect!",
  });
};
