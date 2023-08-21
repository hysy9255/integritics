const mongoose = require("mongoose");
const { Account } = require("../schemas/account.schema.js");
const ObjectId = mongoose.Types.ObjectId;

const getUserPageInfo = async (accountId) => {
  const agg = [
    { $match: { _id: ObjectId(accountId) } },
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        profileImage: 1,
        descriptions: 1,
      },
    },
  ];
  try {
    const user = await Account.aggregate(agg);
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserInfo = async (accountId) => {
  const agg = [
    { $match: { _id: ObjectId(accountId) } },
    { $addFields: { accountId: "$_id" } },
    {
      $project: { _id: 0, name: 1, email: 1, profileImage: 1, descriptions: 1 },
    },
  ];
  try {
    return await Account.aggregate(agg);
  } catch (error) {
    throw error;
  }
};

const getMultipleUserInfos = async (accountIds) => {
  accountIds = accountIds.map((accountId) => ObjectId(accountId));
  const agg = [
    { $match: { _id: { $in: accountIds } } },
    { $addFields: { accountId: "$_id" } },
    { $project: { _id: 0, accountId: 1, name: 1, email: 1, profileImage: 1 } },
  ];
  try {
    return await Account.aggregate(agg);
  } catch (error) {
    throw error;
  }
};

const getUserNames = async (accountIds) => {
  accountIds = accountIds.map((elem) => new ObjectId(elem));
  try {
    return await Account.find(
      { _id: { $in: accountIds } },
      { _id: 0, name: 1 }
    );
  } catch (error) {
    throw error;
  }
};

const getUserNamesWithId = async (accountIds) => {
  accountIds = accountIds.map((elem) => new ObjectId(elem));
  const agg = [
    { $match: { _id: { $in: accountIds } } },
    { $addFields: { accountId: "$_id" } },
    { $project: { _id: 0, accountId: 1, name: 1 } },
  ];
  try {
    return await Account.aggregate(agg);
  } catch (error) {
    throw error;
  }
};

const searchAccounts = async (keyword) => {
  const agg = [
    {
      $search: {
        index: "searchAccounts",
        text: {
          query: keyword,
          path: {
            wildcard: "*",
          },
          fuzzy: { maxEdits: 1, maxExpansions: 300 },
        },
      },
    },
    { $addFields: { accountId: "$_id" } },
    {
      $project: {
        _id: 0,
        accountId: 1,
        name: 1,
        email: 1,
        profileImage: 1,
        descriptions: 1,
      },
    },
    { $limit: 10 },
  ];
  try {
    return await Account.aggregate(agg);
  } catch (error) {
    throw error;
  }
};

const userAutoCompleteSearch = async (keyword) => {
  const agg = [
    {
      $search: {
        index: "userAutoCompleteSearch",
        autocomplete: {
          query: keyword,
          path: "name",
          tokenOrder: "sequential",
        },
      },
    },
    { $project: { _id: 0, name: 1 } },
    { $limit: 4 },
  ];
  try {
    return await Account.aggregate(agg);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserInfo,
  getUserPageInfo,
  getMultipleUserInfos,
  getUserNames,
  getUserNamesWithId,
  searchAccounts,
  userAutoCompleteSearch,
};
