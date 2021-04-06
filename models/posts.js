const mongoose = require("mongoose");

const User = require("./users");

const postSchema = new mongoose.Schema({
  pageTitle: {
    type: String,
    validator: function (v) {
      return v.length <= 60;
    },
    message: "The page title cannot be longer than 60 characters.",
  },
  title: {
    required: [true, "A blog article must have a title"],
    type: String,
  },
  subtitle: String,
  seoDescription: {
    type: String,
    validator: function (v) {
      return v.length >= 120 && v.length <= 320;
    },
    message: "The SEO description must be above 120 characters and below 320!",
  },
  keywords: String,
  slug: { type: String, unique: true, slugPaddingSize: 1 },
  content: String,
  createdAt: Date,
  image: String,
  imageAltText: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

postSchema.pre("save", async function () {
  this.createdAt = Date.now();
  const _ = await User.findOneAndUpdate(
    { _id: this.author },
    { postsMade: this._id },
    { new: true }
  );
  this.image = this.image || "/assets/blog/default-blog-picture";
});

postSchema.pre(/^find/, function (next) {
  this.populate({ path: "author", select: "username" });
  next();
});

module.exports = mongoose.model("Post", postSchema);
