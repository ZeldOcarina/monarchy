const Lead = require("../models/lead");
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

exports.postContact = async (req, res) => {
  try {
    for (let key of Object.keys(req.body))
      if (req.body[key] === "on") req.body[key] = true;

    const lead = await Lead.create(req.body);
    res.locals.message = {
      type: "success",
      message: "Your message has been correctly received. Thank you!!!",
    };
    res.status(201).render("contacts");
  } catch (err) {
    const errors = Object.values(err.errors).map((el) => {
      if (el.message === "Path `privacy_consent` is required.")
        return "Please accept the privacy policy.";
      if (el.message === "Path `first_name` is required.")
        return "Please insert your first name.";
      if (el.message === "Path `last_name` is required.")
        return "Please insert your last name.";
      return el.message;
    });
    const message = `Invalid Form: ${errors.join(" ")}`;

    //console.log(message);

    res.locals.message = {
      type: "error",
      message: message,
    };

    res.status(400).render("contacts");
  }
};
