const mongoose = require("mongoose");
const { app, appState } = require("./app");

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@adyproduction.5cosb.mongodb.net/monarchy-db?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB Connection successful");
  })
  .catch((err) => {
    console.error(err);
    throw err;
  });

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message, err.stack);
  console.log("Uncaught Exception, shutting down");
  process.exit(1);
});

let port = process.env.PORT;
if (port == null || port == "") port = 3000;

//PORT SETUP
const server = app.listen(port, () =>
  console.log("Server started on port " + port)
);

process.on("unhandledRejection", (err) => {
  console.log(err.stack);
  console.log("Unhandled rejection, shutting down");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
