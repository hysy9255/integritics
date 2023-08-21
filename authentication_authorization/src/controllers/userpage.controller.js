const userpageService = require("../services/userpage.service.js");
const { asyncWrap } = require("./../utils/error.js");
const jwt = require("jsonwebtoken");

// ***
const getUserPage = asyncWrap(async (req, res) => {
  const { userId } = req.query;

  const userpage = await userpageService.getUserPage(userId);
  res.status(200).send({ userpage });
});

const getMyPage = asyncWrap(async (req, res) => {
  const token = req.headers.authorization;
  const decoded = await jwt.verify(token, process.env.SECRETE_KEY);
  const userId = decoded.accountId;

  const mypage = await userpageService.getUserPage(userId);
  res.status(200).send(mypage);
});

module.exports = { getUserPage, getMyPage };
