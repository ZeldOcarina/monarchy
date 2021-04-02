exports.getBlogHome = (req, res) => {
  if (req.query.message === "success")
    res.locals.message = {
      type: "success",
      message:
        "Your newsletter subscription has been successful. Thank you! 😊",
    };
  else if (req.query.message === "fail" && !req.query.reason)
    res.locals.message = {
      type: "error",
      message:
        "Your newsletter subscription has not been successful. Please email info@monarchy.io and we will subscribe you manually!",
    };
  else if (req.query.message === "fail" && req.query.reason === "recaptcha")
    res.locals.message = {
      type: "error",
      message: "Your Google verification has failed. Are you maybe a robot? 🤖",
    };
  else if (req.query.message === "fail" && req.query.reason)
    res.locals.message = {
      type: "error",
      message: req.query.reason,
    };

  res.status(200).render("blog/index.ejs", {
    title: "Blog",
    subtitle: "Lear about marketing and strategy. First hand.",
  });
};
