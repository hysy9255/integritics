const express = require("express");
const {
  verifyUser,
  verifyUserOptionally,
  verifyAdmin,
} = require("./../middlewares/signInRequired.js");
const {
  retrievePosts,
  retrieveUserPosts,
  retrieveMyPosts,
  createAPost,
  retrieveAPost,
  updateAPost,
  deleteAPost,
  adminDeleteAPost,
  retrieveTopPosts,
} = require("./../controllers/post.controller.js");

const postRouter = express.Router();

postRouter.get("", verifyUserOptionally, retrieveAPost);
postRouter.get("/list", verifyUserOptionally, retrievePosts);
postRouter.get("/top", verifyUserOptionally, retrieveTopPosts);
postRouter.get("/user/page/:page", verifyUserOptionally, retrieveUserPosts);
postRouter.get("/mine/page/:page", verifyUser, retrieveMyPosts);

postRouter.post("", verifyUser, createAPost);
postRouter.patch("", verifyUser, updateAPost);
postRouter.delete("", verifyUser, deleteAPost);
postRouter.delete("/admin", verifyAdmin, adminDeleteAPost);

module.exports = postRouter;
