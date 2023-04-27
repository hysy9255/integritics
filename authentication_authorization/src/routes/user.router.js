const express = require("express");
const { verifyUser } = require("./../middlewares/signInRequired.js");
const {
  createAccount,
  deleteAccount,
  updatePassword,
  updateUserInfo,
} = require("./../controllers/user.controller.js");

const userRouter = express.Router();

userRouter.post("", createAccount); // ***
userRouter.delete("", verifyUser, deleteAccount); // ***
userRouter.patch("/info", verifyUser, updateUserInfo); // ***
userRouter.patch("/password", verifyUser, updatePassword); // ***

module.exports = userRouter;
