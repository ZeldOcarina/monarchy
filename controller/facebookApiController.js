const axios = require("axios");

const {
  getTimestamp,
  hashData,
  setupPhone,
  handleConversionAPIError,
} = require("../utils/utils");

const access_token = process.env.BC_FACEBOOK_CONVERSION_API_TOKEN;
const pixel_id = process.env.BC_PIXEL_ID;

exports.facebookPageVisit = async (req, res) => {
  const isAngel = req.body.entity === "Angel";
  const access_token = isAngel
    ? process.env.ANGEL_FACEBOOK_CONVERSION_API_TOKEN
    : process.env.BC_FACEBOOK_CONVERSION_API_TOKEN;
  const pixel_id = isAngel
    ? process.env.ANGEL_PIXEL_ID
    : process.env.BC_PIXEL_ID;

  const eventID = isAngel ? "ANGEL_VISIT" : "BC_VISIT";

  const current_timestamp = getTimestamp();

  try {
    const response = await axios({
      url: `https://graph.facebook.com/v10.0/${pixel_id}/events?access_token=${access_token}`,
      method: "POST",
      data: {
        data: [
          {
            event_name: "PageView",
            event_id: eventID,
            event_time: current_timestamp,
            action_source: "website",
            event_id: "BC_VISIT",
            event_source_url: req.body.url,
            user_data: {
              client_ip_address: req.body.ip,
              client_user_agent: req.body.userAgent,
            },
          },
        ],
        //test_event_code: "TEST62031",
      },
    });

    res.status(200).json(response.data);
  } catch (err) {
    handleConversionAPIError(err);
    res.status(500).json(err);
  }
};

exports.facebookLeadEvent = async (req, res) => {
  const isAngel = req.body.entity === "Angel";
  const access_token = isAngel
    ? process.env.ANGEL_FACEBOOK_CONVERSION_API_TOKEN
    : process.env.BC_FACEBOOK_CONVERSION_API_TOKEN;
  const pixel_id = isAngel
    ? process.env.ANGEL_PIXEL_ID
    : process.env.BC_PIXEL_ID;

  const eventID = isAngel ? "ANGEL_LEAD" : "BC_LEAD";
  const current_timestamp = getTimestamp();

  try {
    /*const response = await axios({
      url: `https://graph.facebook.com/v10.0/${pixel_id}/events?access_token=${access_token}`,
      method: "POST",
      data: {
        data: [
          {
            event_name: "Lead",
            event_time: current_timestamp,
            event_id: "BC_LEAD",
            action_source: "website",
            event_source_url: req.body.url,
            event_id: eventID,
            user_data: {
              em: hashData(req.body.email),
              ph: setupPhone(req.body.phone),
              client_ip_address: req.body.ip,
              client_user_agent: req.body.userAgent,
            },
          },
        ],
        //test_event_code: "TEST84298",
      },
    });*/

    res.status(200).json("Lead Connected");
  } catch (err) {
    handleConversionAPIError(err);
    res.status(500).json(err);
  }
};

exports.facebookShopVisitEvent = async (req, res) => {
  const current_timestamp = getTimestamp();

  try {
    const response = await axios({
      url: `https://graph.facebook.com/v10.0/${process.env.BC_PIXEL_ID}/events?access_token=${process.env.BC_FACEBOOK_CONVERSION_API_TOKEN}`,
      method: "POST",
      data: {
        data: [
          {
            event_name: "ShopVisit",
            event_time: current_timestamp,
            action_source: "physical_store",
            //event_source_url: req.body.url,
            user_data: {
              em: hashData(req.body.email),
              ph: setupPhone(req.body.phone),
              //client_ip_address: req.body.ip,
              //client_user_agent: req.body.userAgent,
            },
          },
        ],
        //test_event_code: "TEST56665",
      },
    });

    res.status(200).json("Lead Connected");
  } catch (err) {
    handleConversionAPIError(err);
    res.status(500).json(err);
  }
};

exports.facebookPurchaseEvent = async (req, res) => {
  const current_timestamp = getTimestamp();

  try {
    const response = await axios({
      url: `https://graph.facebook.com/v10.0/${process.env.BC_PIXEL_ID}/events?access_token=${process.env.BC_FACEBOOK_CONVERSION_API_TOKEN}`,
      method: "POST",
      data: {
        data: [
          {
            event_name: "Purchase",
            event_time: current_timestamp,
            action_source: "physical_store",
            //event_source_url: req.body.url,
            user_data: {
              em: hashData(req.body.email),
              ph: setupPhone(req.body.phone),
              //client_ip_address: req.body.ip,
              //client_user_agent: req.body.userAgent,
            },
            custom_data: {
              value: new Number(req.body.purchase_value).toFixed(2),
              content_name: req.body.purchase_item,
              currency: "USD",
              delivery_category: "in_store",
            },
          },
        ],
        //test_event_code: "TEST6588",
      },
    });

    res.status(200).json("Purchase Registered");
  } catch (err) {
    handleConversionAPIError(err);
    res.status(500).json(err);
  }
};
