const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fieldSize: 8 * 1024 * 1024 } });

const {
  uploadHandler,
  removeCurrentPicture,
} = require("../controller/uploads");
const isLoggedIn = require("../middleware/isLoggedIn");
const {
  getBlogHome,
  getNewPostForm,
  createNewPost,
  getSinglePost,
  getEditBlog,
  updatePost,
  deletePost,
} = require("../controller/blogController");

const router = express.Router();

router.get("/", getBlogHome);

router
  .route("/new-post")
  .get(isLoggedIn(), getNewPostForm)
  .post(
    isLoggedIn(),
    upload.single("post-image"),
    uploadHandler,
    createNewPost
  );

router
  .route("/delete/:_id")
  .delete(isLoggedIn(), removeCurrentPicture, deletePost);

router.get("/:slug", getSinglePost);

router.use(isLoggedIn());

router
  .route("/:slug/edit")
  .get(getEditBlog)
  .patch(
    upload.single("post-image"),
    removeCurrentPicture,
    uploadHandler,
    updatePost
  );

module.exports = router;
