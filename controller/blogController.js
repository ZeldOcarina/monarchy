const Post = require("../models/posts");

exports.getBlogHome = async (req, res) => {
  const allPosts = await Post.find({});

  if (req.query.message === "success")
    req.flash(
      "success",
      "Your newsletter subscription has been successful. Thank you! 😊"
    );
  else if (req.query.message === "fail" && !req.query.reason)
    req.flash(
      "error",
      "Your newsletter subscription has not been successful. Please email info@monarchy.io and we will subscribe you manually!"
    );
  else if (req.query.message === "fail" && req.query.reason === "recaptcha")
    req.flash(
      "error",
      "Your Google verification has failed. Are you maybe a robot? 🤖"
    );
  else if (req.query.message === "fail" && req.query.reason)
    req.flash("error", req.query.reason);

  res.status(200).render("blog/index.ejs", {
    title: "Blog",
    subtitle: "Learn about marketing and strategy. First hand.",
    posts: allPosts,
  });
};

exports.getNewPostForm = (req, res) => {
  res
    .status(200)
    .render("blog/makePostForm", { tinyMCEKey: process.env.TINY_MCE_KEY });
};

exports.createNewPost = async (req, res) => {
  try {
    req.body.author = req.user._id;

    const newPost = await Post.create({
      ...req.body,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : "/assets/blog/default-image.jpg",
    });
    res.status(201).json({
      status: "success",
      data: {
        post: newPost,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      data: {
        message: err.message,
      },
    });
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    console.log(req.params);
    const { slug } = req.params;
    const post = await Post.findOne({ slug });

    if (!post) return new Error("Post not found");

    res.status(200).render("blog/blog-single", { post, isBlogShowPage: true });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error has occured while retrieving this blog post.");
    res.status(500).redirect("/blog");
  }
};

exports.getEditBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });
    res
      .status(200)
      .render("blog/editPost", { post, tinyMCEKey: process.env.TINY_MCE_KEY });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      title: "An error ha occurred on our side",
      msg: err.message,
    });
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const user = req.user._id;

    const editedPost = { ...req.body };

    console.log(req.file);

    if (req.file) editedPost.image = "/uploads/" + req.file.filename;

    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, author: user },
      editedPost,
      { new: true }
    );
    if (!post) throw new Error("You cannot update someone else's post");

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    console.error(err);
    req.flash("error", err.message);
    if (err.message === "You cannot update someone else's post") {
      res.status(401).redirect("back");
    } else {
      res.status(500).redirect("back");
    }
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params._id);
    if (!post) return new Error("No post found");
    res.status(204).json({});
  } catch (err) {
    if (err.message === "No post found")
      return res.status(404).json({
        status: "error",
        data: err.message,
      });

    console.error(err);

    return res.status(500).json({
      status: "error",
      data: "A problem occured while deleting this post.",
    });
  }
};
