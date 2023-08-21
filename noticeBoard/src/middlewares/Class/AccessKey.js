const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./../../../env/.env" });
const { detectError } = require("./../../utils/error");

class AccessKey {
  constructor(token) {
    this.token = token;
  }
  checkExistence() {
    if (!this.token) detectError("TOKEN_DOES_NOT_EXIST");
  }
  async decode() {
    const decoded = await jwt.verify(this.token, process.env.SECRETE_KEY);
    if (!decoded) detectError("DECODING_TOKEN_FAILED");
    return [decoded.accountId, decoded.isAdmin];
  }
}

module.exports = { AccessKey };
