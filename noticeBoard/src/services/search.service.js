const { searchAccounts } = require("../utils/superagent.js");
const searchDao = require("./../models/search.dao.js");
const { userAutoCompleteSearch } = require("./../utils/superagent");
const { cookRetrievedPosts } = require("./utils/service.functions");

const autoComplete = async (keyword) => {
  const result = await searchDao.postAutoCompleteSearch(keyword);
  const postResult = result.map((doc) => doc.title);
  const userResult = await userAutoCompleteSearch(keyword);

  const final = postResult.concat(userResult);

  return final;
};

const search = async (keyword) => {
  const postResult = await searchDao.searchPosts(keyword);
  const cookedPosts = await cookRetrievedPosts(postResult);
  const accountResult = await searchAccounts(keyword);

  return {
    posts: cookedPosts,
    accounts: accountResult,
  };
};

module.exports = { search, autoComplete };
