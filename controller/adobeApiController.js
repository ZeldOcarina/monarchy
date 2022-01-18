const path = require("path");
const PDFServicesSdk = require("@adobe/pdfservices-node-sdk");

const nodemailer = require("nodemailer");
const ejs = require("ejs");

const createAdobeDocument = require("../utils/createAdobeDocument");

const AUTHENTICATION_FILE_PATH = path.join(
  __dirname,
  "../secrets/pdfservices-api-credentials.json"
);

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.BC_SENDGRID_USERNAME,
    pass: process.env.BC_SENDGRID_PASSWORD,
  },
});

const mellanoTransporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.MELLANO_SENDGRID_USERNAME,
    pass: process.env.MELLANO_SENDGRID_PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages for BC");
  }
});

mellanoTransporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages for Mina Mellano");
  }
});

exports.handleGiftCardGeneration = async (req, res) => {
  // Get the samples from http://www.adobe.com/go/pdftoolsapi_node_sample
  try {
    const base64String = await createAdobeDocument({
      authenticationFilePath: AUTHENTICATION_FILE_PATH,
      jsonData: req.body.giftCardData,
      pathToTemplateFile: path.join(
        __dirname,
        "../templates/model-gift-card.docx"
      ),
      targetFilePath: path.join(__dirname, "../secrets/sample-pdf.pdf"),
    });

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/emails/bc-gift-card.ejs"),
      {
        firstName: req.body.firstName,
        friendName: req.body.giftCardData.recipientName,
        value: req.body.giftCardData.giftAmount,
      }
    );

    const message = {
      from: "info@bodycontourz.com",
      to: req.body.email,
      subject: "Here's your gift card!",
      html,
      attachments: [
        {
          filename: "gift-card.pdf",
          content: base64String,
          contentType: "application/pdf",
          encoding: "base64",
        },
      ],
    };

    await transporter.sendMail(message);

    if (req.body.recipientEmail) {
      const recipientHtml = await ejs.renderFile(
        path.join(__dirname, "../views/emails/bc-recipient-gift-card.ejs"),
        {
          donatorName: req.body.giftCardData.donatorName,
        }
      );

      const message2 = {
        from: "info@bodycontourz.com",
        to: req.body.recipientEmail,
        subject: "Here's your gift card!",
        html: recipientHtml,
        attachments: [
          {
            filename: "gift-card.pdf",
            content: base64String,
            contentType: "application/pdf",
            encoding: "base64",
          },
        ],
      };

      await transporter.sendMail(message2);
    }

    res.status(201).json({
      status: "success",
      data: base64String,
    });
  } catch (err) {
    if (
      err instanceof PDFServicesSdk.Error.ServiceApiError ||
      err instanceof PDFServicesSdk.Error.ServiceUsageError
    ) {
      console.error("Exception encountered while executing operation", err);
      return res.status(500).send(err);
    } else {
      console.error("Exception encountered while executing operation", err);
      return res.status(500).send(err);
    }
  }
};

exports.handleMinaMellanoCertGeneration = async (req, res) => {
  try {
    if (!req.headers.api_key)
      throw {
        status: 400,
        jsonStatus: "error",
        data: "Please provide an API key as a header in the format api_key: [APY_KEY]",
      };
    if (req.headers.api_key !== process.env.SALESJET_MINA_API_KEY)
      throw { status: 403, jsonStatus: "error", data: "API Key is invalid" };

    jsonData = { ...req.body.certData };
    jsonData.date = new Date().toLocaleDateString("it-IT");
    jsonData.nome_corso = req.body.certData.course_name.split("|")[0].trim();
    jsonData.monte_ore = req.body.certData.course_name.split("|")[1]?.trim();

    delete jsonData.course_name;

    const base64String = await createAdobeDocument({
      authenticationFilePath: AUTHENTICATION_FILE_PATH,
      jsonData,
      pathToTemplateFile: path.join(
        __dirname,
        "../templates/template-attestato.docx"
      ),
      targetFilePath: path.join(__dirname, "../secrets/cert-sample-pdf.pdf"),
    });

    const htmlPromise = ejs.renderFile(
      path.join(__dirname, "../views/emails/mina-email-notification.ejs"),
      {
        first_name: jsonData.first_name,
        last_name: jsonData.last_name,
        course_name: jsonData.nome_corso,
        email: req.body.email,
      }
    );
    const htmlPromise2 = ejs.renderFile(
      path.join(__dirname, "../views/emails/mina-customer-cert-email.ejs"),
      {
        first_name: jsonData.first_name,
        course_name: jsonData.nome_corso,
      }
    );

    const [html, html2] = await Promise.all([htmlPromise, htmlPromise2]);

    const message = {
      from: "formazione@entiform.com",
      to: "formazione@entiform.com",
      subject: "Abbiamo appena emesso un nuovo certificato!",
      html,
      attachments: [
        {
          filename: "certificato.pdf",
          content: base64String,
          contentType: "application/pdf",
          encoding: "base64",
        },
      ],
    };

    const message2 = {
      from: "formazione@entiform.com",
      to: req.body.email,
      subject: "Complimenti! Ecco il suo certificato.",
      html: html2,
      attachments: [
        {
          filename: "certificato.pdf",
          content: base64String,
          contentType: "application/pdf",
          encoding: "base64",
        },
      ],
    };

    const firstMessagePromise = mellanoTransporter.sendMail(message);
    const secondMessagePromise = mellanoTransporter.sendMail(message2);

    await Promise.all([firstMessagePromise, secondMessagePromise]);

    // console.log("Email response:");
    // console.log(response);

    return res.status(201).json({ status: "success", data: base64String });
    //return res.status(201).json({ status: "success", data: jsonData });
  } catch (err) {
    console.log(err);
    try {
      res.status(err.status).json({ status: err.jsonStatus, data: err.data });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        data: "There's an error on our side. Please try again later.",
      });
    }
  }
};
