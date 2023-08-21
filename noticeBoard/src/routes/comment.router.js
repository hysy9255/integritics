const express = require("express");
const commentRouter = express.Router();
const {
  verifyUser,
  verifyUserOptionally,
  verifyAdmin,
} = require("./../middlewares/signInRequired.js");
const {
  createAComment,
  createAReply,
  updateAComment,
  updateAReply,
  deleteAComment,
  deleteAReply,
  retrieveComments,
  retrieveReplies,
  adminDeleteAComment,
} = require("./../controllers/comment.controller.js");

commentRouter.get("", verifyUserOptionally, retrieveComments); // ***
commentRouter.post("", verifyUser, createAComment); // ***
commentRouter.patch("", verifyUser, updateAComment); // ***
commentRouter.delete("", verifyUser, deleteAComment); // ***

commentRouter.get("/reply", verifyUserOptionally, retrieveReplies); // ***
commentRouter.post("/reply", verifyUser, createAReply); // ***
commentRouter.patch("/reply", verifyUser, updateAReply); // ***
commentRouter.delete("/reply", verifyUser, deleteAReply); // ***

commentRouter.delete("/admin", verifyAdmin, adminDeleteAComment); // ***

module.exports = commentRouter;
