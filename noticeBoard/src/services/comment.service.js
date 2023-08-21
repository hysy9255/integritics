const commentDao = require("./../models/comment.dao.js");
const alertDao = require("../models/alert.dao");
const postDao = require("../models/post.dao");
const error = require("./utils/service.error.js");
const { getMultipleUserInfos, getUserNames } = require("../utils/superagent");
const {
  reconstructObject,
  reconstructObjectForReply,
  cookRetrievedComments,
} = require("./utils/service.functions.js");
// ***
const createAComment = async (accountId, requestData) => {
  const { postId } = requestData;
  const { commentId, created } = await commentDao.createAComment(
    accountId,
    requestData
  );
  const postAuthorId = await postDao.getPostAuthorId(postId);
  if (postAuthorId !== accountId) {
    const [userName] = await getUserNames([accountId]);
    const [post] = await postDao.retrieveAPost(postId);
    await alertDao.createAlert.forComment(
      accountId,
      userName,
      postId,
      post.title,
      post.accountId,
      commentId
    );
  }

  const cookedComment = await cookRetrievedComments(created, accountId);
  return reconstructObject(cookedComment);
};
// ***
const retrieveComments = async (loggedInUserId, postId, page) => {
  // 1) 주어진 게시물에 해당되는 댓글을 모두 가져온다.
  const [result] = await commentDao.retrieveComments(postId, page);
  const comments = result.paginatedResults;
  if (result.totalCount.length === 0) {
    return { totalCount: 0, data: [] };
  }
  const totalCount = result.totalCount[0].total;
  const data = await cookRetrievedComments(comments, loggedInUserId);
  return { totalCount, data: reconstructObject(data) };
};

const createAReply = async (accountId, requestData) => {
  await commentDao.createAReply(accountId, requestData);
};

const retrieveReplies = async (loggedInUserId, commentId) => {
  // 주어진 댓글의 해당되는 답글을 모두 가져온다.
  const replies = await commentDao.retrieveReplies(commentId);
  const cookedReplies = await cookRetrievedComments(replies, loggedInUserId);
  return reconstructObject(cookedReplies);
};
// ***
const updateAComment = async (accountId, requestData) => {
  const { commentId } = requestData;
  const comment = await commentDao.findAComment(commentId);
  error.checkTheAuthor(accountId, comment);
  await commentDao.updateAComment(requestData);
};
// ***
const updateAReply = async (accountId, requestData) => {
  const { replyId } = requestData;
  const reply = await commentDao.findAReply(replyId);
  error.checkTheAuthor(accountId, reply);
  await commentDao.updateAReply(requestData);
};
// ***
const deleteAComment = async (isAdmin, requestData, accountId) => {
  const { commentId } = requestData;
  const comment = await commentDao.findAComment(commentId);
  if (!isAdmin) error.checkTheAuthor(accountId, comment);
  await commentDao.deleteAComment(requestData);
  await alertDao.deleteAlert.forComment(commentId);
};
// ***
const deleteAReply = async (isAdmin, requestData, accountId) => {
  const { replyId } = requestData;
  const reply = await commentDao.findAReply(replyId);
  if (!isAdmin) error.checkTheAuthor(accountId, reply);
  await commentDao.deleteAReply(requestData);
};

module.exports = {
  createAComment,
  createAReply,
  updateAComment,
  updateAReply,
  retrieveComments,
  retrieveReplies,
  deleteAComment,
  deleteAReply,
};
