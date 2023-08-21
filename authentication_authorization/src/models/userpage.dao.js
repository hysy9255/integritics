const mongoose = require("mongoose");
const { Account } = require("../schemas/account.schema.js");
const ObjectId = mongoose.Types.ObjectId;

const getUserPage = async (userId) => {
  const agg = [
    { $match: { _id: ObjectId(userId) } },
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
    const [user] = await Account.aggregate(agg);
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserPage };
