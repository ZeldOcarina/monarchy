const path = require("path");
const ejs = require("ejs");

const axios = require("axios");

const transporter = require("../config/nodemailer-setup");
const Lead = require("../models/lead");

exports.getContactsPage = (req, res) => {
  res.status(200).render("contacts", {
    title: "Get in Touch",
    subtitle: "Tell us more about yourself and let's connect!",
  });
};

exports.checkRecaptcha = async (req, res, next) => {
  const googleEndpoint = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body["g-recaptcha-response"]}`;

  try {
    const response = await axios.post(googleEndpoint);

    if (!response.data.success)
      throw new Error(
        "Your Google verification has failed. Are you maybe a robot? 🤖"
      );

    return next();
  } catch (err) {
    if (
      err.message !==
      "Your Google verification has failed. Are you maybe a robot? 🤖"
    )
      console.error(err);
    res.locals.message = {
      type: "error",
      message: err.message,
    };

    if (req.originalUrl === "/contacts/newsletter-subscription")
      return res.status(403).redirect("/blog?message=fail&reason=recaptcha");
    else return res.status(403).render("contacts");
  }
};

exports.organizeFormData = (req, res, next) => {
  for (let key of Object.keys(req.body))
    if (req.body[key] === "on") req.body[key] = true;

  //   console.log(req.originalUrl);
  //   console.log(req.body);

  if (
    req.originalUrl === "/contacts/newsletter-subscription" &&
    !req.body.promotional_consent
  )
    return res
      .status(400)
      .redirect(
        "/blog?message=fail&reason=You must accept to receive our newsletter!"
      );

  next();
};

exports.sendEmail = async (req, res, next) => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/emails/lead.ejs"),
      { req: req.body }
    );

    const message = {
      from: "info@monarchy.io",
      //to: 'nicole@monarchy.io',
      to: "mattia@monarchy.io",
      subject: "We have a new Monarchy lead from the website! 📈",
      html,
    };

    await transporter.sendMail(message);
    next();
  } catch (err) {
    console.error(err);
    res.locals.message = {
      type: "error",
      message:
        "There has been a problem submitting your message. Please write info@monarchy.io",
    };

    if (req.originalUrl === "/contacts") res.status(500).render("contacts");
  }
};

exports.postContact = async (req, res, next) => {
  try {
    //await Lead.create(req.body);

    res.locals.message = {
      type: "success",
      message: "Your message has been correctly received. Thank you!!!",
    };

    next();
  } catch (err) {
    console.error(err);
    const errors = Object.values(err.errors).map((el) => {
      if (el.message === "Path `privacy_consent` is required.")
        return "Please accept the privacy policy.";
      if (el.message === "Path `first_name` is required.")
        return "Please insert your first name.";
      return el.message;
    });
    const message = `Invalid Form: ${errors.join(" ")}`;

    res.locals.message = {
      type: "error",
      message: message,
    };

    if (req.originalUrl === "/contacts") res.status(400).render("contacts");
    else res.status(400).redirect(`/blog?message=fail&reason=${message}`);
  }
};

exports.redirectToPage = (req, res) => {
  console.log(req.originalUrl);
  if (req.originalUrl === "/contacts") {
    res.status(201).render("contacts");
  } else {
    res.status(201).redirect("/blog?message=success");
  }
};

exports.postToSalesJet = async (req, res, next) => {
  try {
    if (!req.body.promotional_consent) return next();
    const response = await axios({
      url: "https://sj-api.com/externalapp/track",
      headers: {
        Authorization: process.env.SALESJET_API_KEY,
      },
      method: "POST",
      data: {
        event_name: "monarchy-newsletter-subscription",
        contact: req.body,
      },
    });
    next();
  } catch (err) {
    console.error(err);

    if (req.originalUrl === "/contacts") {
      res.locals.message = {
        type: "error",
        message:
          "We had a problem subscribing you to our newsletter. Please write info@monarchy.io",
      };

      res.status(500).render("contacts");
    }
    res.status(500).redirect("/blog?message=fail");
  }
};
