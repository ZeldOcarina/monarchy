const fs = require("fs").promises;
const path = require("path");
const PDFServicesSdk = require("@adobe/pdfservices-node-sdk");

const nodemailer = require("nodemailer");
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.BC_SENDGRID_USERNAME,
    pass: process.env.BC_SENDGRID_PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages for BC");
  }
});

exports.handleGiftCardGeneration = async (req, res) => {
  // Get the samples from http://www.adobe.com/go/pdftoolsapi_node_sample
  try {
    // Initial setup, create credentials instance.
    const credentials =
      PDFServicesSdk.Credentials.serviceAccountCredentialsBuilder()
        .fromFile(
          path.join(__dirname, "../secrets/pdfservices-api-credentials.json")
        )
        .build();

    const jsonDataForMerge = req.body.giftCardData;

    // Create an ExecutionContext using credentials.
    const executionContext =
      PDFServicesSdk.ExecutionContext.create(credentials);

    // Create a new DocumentMerge options instance.
    const documentMerge = PDFServicesSdk.DocumentMerge;
    const documentMergeOptions = documentMerge.options;
    const options = new documentMergeOptions.DocumentMergeOptions(
      jsonDataForMerge,
      documentMergeOptions.OutputFormat.PDF
    );

    // Create a new operation instance using the options instance.
    const documentMergeOperation = documentMerge.Operation.createNew(options);

    // Set operation input document template from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile(
      path.join(__dirname, "../templates/model-gift-card.docx")
    );

    documentMergeOperation.setInput(input);

    // Execute the operation and Save the result to the specified location.
    const result = await documentMergeOperation.execute(executionContext);

    const targetDirectory = path.join(__dirname, "../secrets/sample-pdf.pdf");

    await result.saveAsFile(targetDirectory);
    const base64String = await fs.readFile(targetDirectory, {
      encoding: "base64",
    });

    // Clean up FS
    await fs.unlink(targetDirectory);

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
