const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  accountId: { type: String, require: true },
  contents: { type: String, require: true },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const commentSchema = new mongoose.Schema({
  postId: { type: String, require: true },
  accountId: { type: String, require: true },
  contents: { type: String, require: true },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
  replies: { type: [replySchema], default: [] },
});

module.exports = { commentSchema };
