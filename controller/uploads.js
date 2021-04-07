const { unlink } = require("fs").promises;
const path = require("path");
const slugify = require("slugify");
const sharp = require("sharp");

const Post = require("../models/posts");

exports.removeCurrentPicture = async (req, res, next) => {
  try {
    let postId;
    if (req.params && req.params._id) postId = req.params._id;
    else postId = req.body._id;

    const post = await Post.findById(postId);

    if (!post.image) return next();

    const appDir = path.dirname(require.main.filename);
    await unlink(path.join(appDir, "public", post.image));
    next();
  } catch (err) {
    if (err.code === "ENOENT") return next();
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

exports.uploadHandler = async (req, res, next) => {
  if (!req.file) return next();

  const newFilename = req.file.originalname.replace(
    path.extname(req.file.originalname),
    ".jpg"
  );
  console.log(newFilename);

  req.file.filename = slugify(newFilename).toLowerCase();

  await sharp(req.file.buffer)
    .resize(1200, 476, { fit: "cover", position: "center" })
    .toFormat("jpg")
    .jpeg({ quality: 90 })
    .toFile(`public/uploads/${req.file.filename}`);

  next();
};
