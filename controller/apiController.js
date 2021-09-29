const axios = require("axios");

exports.upliffsNewCustomer = async (req, res) => {
  try {
    const { first_name, last_name, email, accepts_marketing } = req.body;

    if (!accepts_marketing)
      return new Error("Newsletter subscription not possible");

    await axios({
      url: "https://sj-api.com/externalapp/track",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.SALESJET_UPLIFFS_API_KEY,
      },
      data: {
        event_name: "customer_created",
        contact: { first_name, last_name, email },
      },
    });

    return res
      .status(201)
      .json({ status: "success", message: "Customer successfully created" });
  } catch (err) {
    if (err.message === "Newsletter subscription not possible")
      return res.status(400).json({
        status: "error",
        message: "We only accept customers that opt-in.",
      });
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "An error has occured while processing this request.",
    });
  }
};

exports.calendlyNewEvent = async (req, res) => {
  try {
    console.log(req.body);
    const {
      payload: { email },
    } = req.body;

    if (email === "info@bodycontourz.com")
      return res.status(200).json({
        status: "success",
        data: "Sales Jet connection not necessary",
      });

    await axios({
      url: "https://sj-api.com/externalapp/track",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.SALESJET_BC_API_KEY,
      },
      data: {
        event_name: "calendly_creation",
        contact: { email },
      },
    });

    return res
      .status(201)
      .json({ status: "success", message: "Appointment successfully created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "An error has occured while processing this request.",
    });
  }
};

exports.calendlyAccountEvent = async (req, res) => {
  const account = req.params.account;
  try {
    // console.log(req.body);
    // console.log(account);

    const {
      payload: { email, name },
    } = req.body;

    const [first_name, last_name] = name.split(" ");

    await axios({
      url: "https://sj-api.com/externalapp/track",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.SALESJET_VIVA_API_KEY,
      },
      data: {
        event_name: "calendly_creation",
        contact: { email, first_name, last_name },
      },
    });

    return res
      .status(201)
      .json({ status: "success", message: "Appointment successfully created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "An error has occured while processing this request.",
    });
  }
};
