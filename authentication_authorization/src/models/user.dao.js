const { detectError } = require("../utils/error");
const { Account } = require("../schemas/account.schema");
// ***
const createAccount = async (name, email, password) => {
  try {
    await Account.create({
      name,
      email,
      password,
      isAdmin: false,
      isBlocked: false,
    });
  } catch (error) {
    throw error;
  }
};
// ***
const findAcctByEmail = async (email) => {
  try {
    const account = await Account.findOne({ email });
    return account;
  } catch (error) {
    throw error;
  }
};
// ***
const findAcctById = async (accountId) => {
  try {
    const account = await Account.findById(accountId);
    if (!account) {
      detectError(
        "Account that corresponds to the token doesn't exists. Make sure to use a valid token",
        400
      );
    }
    return account;
  } catch (error) {
    throw error;
  }
};
// ***
const updatePassword = async (accountId, newHashedPassword) => {
  try {
    const account = await Account.findOne({ _id: accountId });
    account.password = newHashedPassword;
    await account.save();
  } catch (error) {
    throw error;
  }
};
// ***
const deleteAccount = async (accountId) => {
  try {
    await Account.deleteOne({ _id: accountId });
  } catch (error) {
    throw error;
  }
};

const updateUserInfo = async (accountId, requestData) => {
  console.log(requestData);
  const { profileImage, descriptions } = requestData;
  try {
    return await Account.updateOne(
      { _id: accountId },
      { $set: { profileImage, descriptions } }
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAccount,
  findAcctByEmail,
  findAcctById,
  updatePassword,
  deleteAccount,
  updateUserInfo,
};
