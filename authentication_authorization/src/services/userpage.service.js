const userpageDao = require("./../models/userpage.dao.js");

const getUserPage = async (userId) => {
  return await userpageDao.getUserPage(userId);
};

module.exports = { getUserPage };
