const express = require("express");
const infoRouter = express.Router();
const { verifyUserOptionally } = require("../middlewares/signInRequired");
const {
  getUserPageInfo,
  getUserInfo,
  getMultipleUserInfos,
  getUserNames,
  getUserNamesWithId,
  searchAccounts,
  userAutoCompleteSearch,
} = require("../controllers/info.controller.js");

infoRouter.get("/userPage", verifyUserOptionally, getUserPageInfo);
infoRouter.get("", getUserInfo);
infoRouter.get("/list", getMultipleUserInfos);
infoRouter.post("/userNames", getUserNames);
infoRouter.post("/userNamesWithId", getUserNamesWithId);
infoRouter.get("/search", searchAccounts);
infoRouter.get("/search/autoComplete", userAutoCompleteSearch);

module.exports = infoRouter;
