const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  company: String,
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "The email provided does not seem to be valid.",
    },
  },
  first_name: {
    type: String,
    required: true,
    message: "Please provide your first name",
  },
  last_name: String,
  is_company: Boolean,
  needs_marketing: Boolean,
  needs_sales: Boolean,
  consulting: Boolean,
  branding: Boolean,
  job_applier: Boolean,
  press_member: Boolean,
  influencer: Boolean,
  company_size: String,
  marketing_spent: String,
  message: String,
  privacy_consent: {
    type: Boolean,
    required: true,
    enum: [true],
    message: "Please accept the privacy policy.",
  },
  promotional_consent: Boolean,
});

leadSchema.pre("validate", function (next) {
  //console.log(this);
  //console.log("pre-validate hook");
  next();
});

module.exports = mongoose.model("Lead", leadSchema);
