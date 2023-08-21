const commentService = require("./../services/comment.service.js");
const { asyncWrap } = require("./../utils/error.js");
// ***
const createAComment = asyncWrap(async (req, res) => {
  const accountId = res.locals.accountId;
  const requestData = req.body;
  const created = await commentService.createAComment(accountId, requestData);
  res.status(201).send({ message: "Comment has been created", created });
});
const createAReply = asyncWrap(async (req, res) => {
  const accountId = res.locals.accountId;
  const requestData = req.body;
  await commentService.createAReply(accountId, requestData);
  res.status(201).send({ message: "Reply has been created" });
});
// ***
const updateAComment = asyncWrap(async (req, res) => {
  const accountId = res.locals.accountId;
  const requestData = req.body;
  await commentService.updateAComment(accountId, requestData);
  res.status(200).send({ message: "Comment has been updated" });
});
// ***
const updateAReply = asyncWrap(async (req, res) => {
  const accountId = res.locals.accountId;
  const requestData = req.body;
  await commentService.updateAReply(accountId, requestData);
  res.status(200).send({ message: "Reply has been updated" });
});
// ***
const deleteAComment = asyncWrap(async (req, res) => {
  const { isAdmin, accountId } = res.locals;
  const requestData = req.body;
  await commentService.deleteAComment(isAdmin, requestData, accountId);
  res.status(200).send({ message: "Comment has been deleted" });
});
// ***
const deleteAReply = asyncWrap(async (req, res) => {
  const { isAdmin, accountId } = res.locals;
  const requestData = req.body;
  await commentService.deleteAReply(isAdmin, requestData, accountId);
  res.status(200).send({ message: "Reply has been deleted" });
});
// ***
const adminDeleteAComment = asyncWrap(async (req, res) => {
  const { isAdmin } = res.locals;
  const requestData = req.body;
  await commentService.deleteAComment(isAdmin, requestData);
  res.status(200).json({ message: "Admin has deleted the comment" });
});
// ***
const retrieveComments = asyncWrap(async (req, res) => {
  const loggedInUserId = res.locals.accountId;
  const { postId, page } = req.query;
  const { totalCount, data } = await commentService.retrieveComments(
    loggedInUserId,
    postId,
    page
  );
  res.status(200).json({ totalCount, data });
});

const retrieveReplies = asyncWrap(async (req, res) => {
  const loggedInUserId = res.locals.accountId;
  const { commentId } = req.query;
  const replies = await commentService.retrieveReplies(
    loggedInUserId,
    commentId
  );
  res.status(200).send(replies);
});

module.exports = {
  createAComment,
  createAReply,
  updateAComment,
  updateAReply,
  deleteAComment,
  deleteAReply,
  retrieveComments,
  retrieveReplies,
  adminDeleteAComment,
};
