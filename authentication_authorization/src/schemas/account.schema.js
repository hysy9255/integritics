const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  isAdmin: { type: Boolean },
  isBlocked: { type: Boolean },
  profileImage: { type: String, default: null },
  descriptions: { type: String, default: null },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const Account = mongoose.model("account", accountSchema);

module.exports = { Account, accountSchema };
