const crypto = require("crypto");
const axios = require("axios");
const transporter = require("../config/nodemailer-setup");

const access_token = process.env.FACEBOOK_CONVERSION_API_TOKEN;
const pixel_id = process.env.FACEBOOK_PIXEL_ID;

exports.facebookPageVisit = async (req, res) => {
  const current_timestamp = Math.floor(new Date() / 1000);

  try {
    const response = await axios({
      url: `https://graph.facebook.com/v10.0/${pixel_id}/events?access_token=${access_token}`,
      method: "POST",
      data: {
        data: [
          {
            event_name: "PageView",
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
  const current_timestamp = Math.floor(new Date() / 1000);
  const hashedEmail = crypto
    .createHash("sha256")
    .update(req.body.email)
    .digest("hex");

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
            event_source_url: "https://my.ultraslimbybodycontourz.com/general",
            user_data: {
              em: hashedEmail,
              client_ip_address: "192.19.19.4",
              client_user_agent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
            },
          },
        ],
        test_event_code: "TEST67144",
      },
    });

    console.log(response);

    res.json(response);
  } catch (err) {
    res.json(err);
  }
};
