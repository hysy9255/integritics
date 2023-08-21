const express = require("express");
const {
  getUserPage,
  getMyPage,
} = require("../controllers/userpage.controller.js");

const userpageRouter = express.Router();

userpageRouter.get("", getUserPage); // ***
userpageRouter.get("/mypage", getMyPage);

module.exports = userpageRouter;
