const { Account } = require("../schemas/account.schema.js");
// ***
const findAcctByEmail = async (email) => {
  try {
    return await Account.findOne({ email });
  } catch (error) {
    throw error;
  }
};

module.exports = { findAcctByEmail };
