const mongoose = require("mongoose");
const { commentSchema } = require("../schemas/comment.schema");
const Comment = mongoose.model("comment", commentSchema);
const { ObjectId } = require("mongodb");
// ***
const createAComment = async (accountId, requestData) => {
  const { postId, contents } = requestData;
  try {
    const comment = await Comment.create({ accountId, postId, contents });
    const created = await Comment.aggregate([
      { $match: { _id: comment._id } },
      { $addFields: { commentId: "$_id" } },
      { $project: { _id: 0, postId: 0, replies: 0, __v: 0 } },
    ]);
    return { commentId: comment._id.toString(), created };
  } catch (error) {
    throw error;
  }
};
// ***
const retrieveComments = async (postId, page) => {
  if (page === undefined) {
    page = 1;
  }
  const limit = 10;
  const skip = 10 * (page - 1);
  const agg = [
    { $match: { postId } },
    {
      $addFields: { commentId: "$_id" },
    },
    {
      $sort: { createdAt: 1 },
    },
    {
      $facet: {
        totalCount: [{ $count: "total" }],
        paginatedResults: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              commentId: 1,
              accountId: 1,
              contents: 1,
              createdAt: 1,
              updatedAt: 1,
              replyCount: { $size: "$replies" },
            },
          },
        ],
      },
    },
  ];
  try {
    return await Comment.aggregate(agg);
  } catch (error) {
    throw error;
  }
};
// ***
const createAReply = async (accountId, requestData) => {
  const { commentId, postId, contents } = requestData;
  try {
    const comment = await Comment.findOne({ postId, _id: commentId });
    comment.replies.push({ contents, accountId });
    await comment.save();
  } catch (error) {
    throw error;
  }
};

// ***
const retrieveReplies = async (commentId) => {
  const agg = [
    { $match: { _id: new ObjectId(commentId) } },
    {
      $project: {
        _id: 0,
        replies: {
          $map: {
            input: "$replies",
            as: "reply",
            in: {
              commentId: "$$reply._id",
              accountId: "$$reply.accountId",
              contents: "$$reply.contents",
              createdAt: "$$reply.createdAt",
              updatedAt: "$$reply.updatedAt",
            },
          },
        },
      },
    },
  ];
  try {
    const [result] = await Comment.aggregate(agg);
    return result.replies;
  } catch (error) {
    throw error;
  }
};
// ***
const findAComment = async (commentId) => {
  try {
    return await Comment.findById(commentId);
  } catch (error) {
    throw error;
  }
};
// ***
const findAReply = async (replyId) => {
  replyId = new ObjectId(replyId);
  const agg = [
    { $match: { "replies._id": replyId } },
    {
      $project: {
        _id: 0,
        reply: {
          $filter: {
            input: "$replies",
            as: "reply",
            cond: { $eq: ["$$reply._id", replyId] },
          },
        },
      },
    },
  ];
  try {
    const [result] = await Comment.aggregate(agg);
    return result.reply[0];
  } catch (error) {
    throw error;
  }
};
// ***
const updateAComment = async (requestData) => {
  const { commentId, newContents } = requestData;
  try {
    const comment = await Comment.findById(commentId);
    comment.contents = newContents;
    await comment.save();
  } catch (error) {
    throw error;
  }
};
// ***
const updateAReply = async (requestData) => {
  const { replyId, newContents } = requestData;
  try {
    await Comment.updateOne(
      { "replies._id": replyId },
      {
        $set: { "replies.$.contents": newContents },
      }
    );
  } catch (error) {
    throw error;
  }
};
// ***
const deleteAComment = async (requestData) => {
  const { commentId } = requestData;
  try {
    await Comment.deleteOne({ _id: commentId });
  } catch (error) {
    throw error;
  }
};
// ***
const deleteAReply = async (requestData) => {
  const { replyId } = requestData;
  try {
    await Comment.updateOne(
      { "replies._id": replyId },
      { $pull: { replies: { _id: replyId } } }
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAComment,
  createAReply,
  updateAComment,
  updateAReply,
  deleteAComment,
  deleteAReply,
  findAComment,
  findAReply,
  retrieveComments,
  retrieveReplies,
};
