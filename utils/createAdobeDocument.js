const fs = require("fs").promises;
const PDFServicesSdk = require("@adobe/pdfservices-node-sdk");

module.exports = async function createAdobeDocument({
  authenticationFilePath,
  jsonData,
  pathToTemplateFile,
  targetFilePath,
}) {
  // Initial setup, create credentials instance.
  const credentials =
    PDFServicesSdk.Credentials.serviceAccountCredentialsBuilder()
      .fromFile(authenticationFilePath)
      .build();
  const jsonDataForMerge = jsonData;

  // Create an ExecutionContext using credentials.
  const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

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
  const input = PDFServicesSdk.FileRef.createFromLocalFile(pathToTemplateFile);

  documentMergeOperation.setInput(input);

  // Execute the operation and Save the result to the specified location.
  const result = await documentMergeOperation.execute(executionContext);

  const targetDirectory = targetFilePath;

  await result.saveAsFile(targetDirectory);
  const base64String = await fs.readFile(targetDirectory, {
    encoding: "base64",
  });

  // Clean up FS
  await fs.unlink(targetDirectory);
  return base64String;
};
