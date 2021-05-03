const axios = require("axios");
const transporter = require("../config/nodemailer-setup");

const { getTimestamp, hashData, setupPhone } = require("../utils/utils");

const access_token = process.env.FACEBOOK_CONVERSION_API_TOKEN;
const pixel_id = process.env.FACEBOOK_PIXEL_ID;

exports.facebookPageVisit = async (req, res) => {
  const current_timestamp = getTimestamp();

  try {
    const response = await axios({
      url: `https://graph.facebook.com/v10.0/${pixel_id}/events?access_token=${access_token}`,
      method: "POST",
      data: {
        data: [
          {
            event_name: "PageView",
            event_id: "BC_VIEW",
            event_time: current_timestamp,
            action_source: "website",
            event_source_url: req.body.url,
            user_data: {
              client_ip_address: req.body.ip,
              client_user_agent: req.body.userAgent,
            },
          },
        ],
      },
    });

    res.status(200).json(response.data);
  } catch (err) {
    const message = {
      from: "info@monarchy.io",
      //to: 'nicole@monarchy.io',
      to: "mattia@monarchy.io",
      subject:
        "We have an error on the Body Contourz FB API Conversions setup.",
      html: `<p>Here is the error we are having:</p><p>${err.stack}</p>`,
    };

    await transporter.sendMail(message);
    console.log(err);
    res.status(500).json(err);
  }
};

exports.facebookLeadEvent = async (req, res) => {
  const current_timestamp = getTimestamp();

  const hashedEmail = hashData(req.body.email);
  const hashedPhone = setupPhone(req.body.phone);

  try {
    const response = await axios({
      url: `https://graph.facebook.com/v10.0/${pixel_id}/events?access_token=${access_token}`,
      method: "POST",
      data: {
        data: [
          {
            event_name: "Lead",
            event_time: current_timestamp,
            action_source: "website",
            event_source_url: req.body.url,
            event_id: "BC_LEAD",
            user_data: {
              em: hashedEmail,
              ph: hashedPhone,
              client_ip_address: req.body.ip,
              client_user_agent: req.body.userAgent,
            },
          },
        ],
        // test_event_code: "TEST76951",
      },
    });

    res.status(200).json("Lead Connected");
  } catch (err) {
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
    res.status(500).json(err);
  }
};
