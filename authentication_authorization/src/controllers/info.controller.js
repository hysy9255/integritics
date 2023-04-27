const infoService = require("../services/info.service.js");
const { asyncWrap } = require("../utils/error.js");

const getUserPageInfo = asyncWrap(async (req, res) => {
  const userInfo = await infoService.getUserPageInfo(req, res);
  res.status(200).json(userInfo);
});

const getUserInfo = asyncWrap(async (req, res) => {
  const { accountId } = req.query;
  const userInfo = await infoService.getUserInfo(accountId);
  res.status(200).json(userInfo);
});

const getMultipleUserInfos = asyncWrap(async (req, res) => {
  let { accountIds } = req.query;
  if (!Array.isArray(accountIds)) {
    accountIds = [accountIds];
  }
  const userInfos = await infoService.getMultipleUserInfos(accountIds);
  res.status(200).json(userInfos);
});

const getUserNames = asyncWrap(async (req, res) => {
  const accountIds = req.body.accountIds;
  const userNames = await infoService.getUserNames(accountIds);
  res.status(200).json({ userNames });
});

const getUserNamesWithId = asyncWrap(async (req, res) => {
  const accountIds = req.body.accountIds;
  const userNames = await infoService.getUserNamesWithId(accountIds);
  res.status(200).json({ userNames });
});

const searchAccounts = asyncWrap(async (req, res) => {
  const keyword = req.query.keyword;
  const userAccounts = await infoService.searchAccounts(keyword);
  res.status(200).json(userAccounts);
});

module.exports = {
  getUserPageInfo,
  getUserInfo,
  getMultipleUserInfos,
  getUserNames,
  getUserNamesWithId,
  searchAccounts,
};
