const superagent = require("superagent");

const authServerAddress = `${process.env.AUTH_SERVER_HOST}:${process.env.AUTH_SERVER_PORT}`;
// const authServerAddress = `http://localhost:3006`;
// const authServerAddress = "http://3.36.119.237:81";
// dddddd
const pathForGettingUserInfo = "/auth/userInfo";
const pathForGettingMultipleUserInfos = "/auth/userInfo/list";
const pathForGettingUserNames = "/auth/userInfo/userNames";
const pathForGettingUserNamesWithId = "/auth/userInfo/userNamesWithId";
const pathForGettingSearchAccount = "/auth/userInfo/search";
const pathForUserAutoCompleteSearch = "/auth/userInfo/search/autoComplete";

const getUserInfo = async (accountId) => {
  const response = await superagent
    .get(authServerAddress + pathForGettingUserInfo)
    .query({ accountId });

  return response.body;
};
// ***
const getMultipleUserInfos = async (accountIds) => {
  const response = await superagent
    .get(authServerAddress + pathForGettingMultipleUserInfos)
    .query({ accountIds });

  return response.body;
};
// ***
const getUserNames = async (accountIds) => {
  const response = await superagent
    .post(authServerAddress + pathForGettingUserNames)
    .send({ accountIds });
  return response.body.userNames;
};

const getUserNamesWithId = async (accountIds) => {
  const response = await superagent
    .post(authServerAddress + pathForGettingUserNamesWithId)
    .send({ accountIds });
  return response.body.userNames;
};

const searchAccounts = async (keyword) => {
  const response = await superagent
    .get(authServerAddress + pathForGettingSearchAccount)
    .query({ keyword });

  return response.body;
};

const userAutoCompleteSearch = async (keyword) => {
  const response = await superagent
    .get(authServerAddress + pathForUserAutoCompleteSearch)
    .query({ keyword });
  return response.body;
};

module.exports = {
  getUserInfo,
  getMultipleUserInfos,
  getUserNames,
  getUserNamesWithId,
  searchAccounts,
  userAutoCompleteSearch,
};
