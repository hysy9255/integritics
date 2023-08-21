// ***
const reconstructObject = (inputArray) => {
  newarray = [];
  for (let i = 0; i < inputArray.length; i++) {
    const outerObject = {};
    const comment = {};
    comment.contents = inputArray[i].contents;
    comment.createdAt = inputArray[i].createdAt;
    comment.updatedAt = inputArray[i].updatedAt;
    comment.commentId = inputArray[i].commentId;
    comment.likes = inputArray[i].likes ? inputArray[i].likes : 0;
    comment.replyCount = inputArray[i].replyCount;
    comment.usersWhoLiked = inputArray[i].users;
    outerObject.comment = comment;

    const author = {};
    author.accountId = inputArray[i].accountId;
    author.name = inputArray[i].name;
    author.email = inputArray[i].email;
    author.profileImage = inputArray[i].profileImage;
    outerObject.author = author;

    const user = {};
    user.likeStatus = inputArray[i].likeStatus;
    user.modifyAllowed = inputArray[i].modifyAllowed;
    user.deleteAllowed = inputArray[i].deleteAllowed;
    outerObject.user = user;

    newarray.push(outerObject);
  }
  return newarray;
};

const postDao = require("../../models/post.dao");
const { mainCatDao, subCatDao } = require("../../models/category.dao");
const { getMultipleUserInfos } = require("../../utils/superagent");
const { ObjectId } = require("mongodb");
const likeDao = require("../../models/like.dao");

// ***
const cookRetrievedPosts = async (posts) => {
  // 추가 기능)
  const mainCatIds = posts.map((doc) => new ObjectId(doc.mainCatId));
  const subCatIds = posts.map((doc) => new ObjectId(doc.subCatId));
  const mainCatNames = await mainCatDao.getNamesByIds(mainCatIds);
  const subCatNames = await subCatDao.getNamesByIds(subCatIds);
  // 2) 게시물 작성자의 정보 가져오기
  const authorIds = posts.map((doc) => doc.accountId);
  const authorInfos = await getMultipleUserInfos(authorIds);
  // 3) 각 게시물의 좋아요 갯수 가져오기
  const postIds = posts.map((doc) => doc.postId.toString());
  const likes = await likeDao.retrieveLikesForPosts(postIds);
  // 1) + 2) + 3)
  const merged = [];
  for (let i = 0; i < posts.length; i++) {
    merged.push({
      ...posts[i],
      ...authorInfos.find((elem) => elem.accountId === posts[i].accountId),
      ...likes.find((doc) => doc.postId === posts[i].postId.toString()),
      ...mainCatNames.find(
        (doc) => doc.mainCatId.toString() === posts[i].mainCatId
      ),
      ...subCatNames.find(
        (doc) => doc.subCatId.toString() === posts[i].subCatId
      ),
    });
    merged[i].likes = merged[i].likes ? merged[i].likes : 0;
  }
  return merged;
};
const { getUserNames } = require("../../utils/superagent");
const cookRetrievedComments = async (comments, loggedInUserId) => {
  // 2) 댓글 작성자의 정보를 가져온다.
  const authorIds = comments.map((doc) => doc.accountId);
  const authorInfos = await getMultipleUserInfos(authorIds);
  // 3) 댓글의 좋아요 갯수와 좋아요를 누른 회원의 정보를 가져온다.
  const commentIds = comments.map((doc) => doc.commentId.toString());
  const commentLikes = await likeDao.retrieveLikesForComments(commentIds);

  if (!commentLikes[0]) {
    for (let i = 0; i < commentLikes.length; i++) {
      commentLikes[i].users = await getUserNames(commentLikes[i].users);
    }
  }
  // 4) 로그인한 회원이 좋아요를 누른 댓글 아이디를 가져온다.
  const likeExists = await likeDao.findALikeForComments(
    loggedInUserId,
    commentIds
  );

  const merged = [];
  for (let i = 0; i < comments.length; i++) {
    merged.push({
      ...comments[i],
      ...authorInfos.find((elem) => elem.accountId === comments[i].accountId),
    });
  }

  const merged2 = [];
  for (let i = 0; i < merged.length; i++) {
    merged2.push({
      ...merged[i],
      ...commentLikes.find(
        (doc) => doc.commentId === merged[i].commentId.toString()
      ),
    });
    let condition = likeExists.find(
      (doc) => doc.commentId === merged[i].commentId.toString()
    );
    if (condition) merged2[i].likeStatus = true;
    else merged2[i].likeStatus = false;

    if (loggedInUserId === merged[i].accountId)
      [merged2[i].modifyAllowed, merged2[i].deleteAllowed] = [true, true];
    else [merged2[i].modifyAllowed, merged2[i].deleteAllowed] = [false, false];
  }

  return merged2;
};

const {
  checkViewRecords,
  insertViewRecords,
} = require("../../models/post.dao");

const updateViewMechanism = async (postId, ip, userId) => {
  const record = await checkViewRecords(postId, ip, userId);
  if (!record[0]) {
    await insertViewRecords(postId, ip, userId);
    await postDao.updateViews(postId);
  }
};

module.exports = {
  reconstructObject,
  cookRetrievedPosts,
  cookRetrievedComments,
  updateViewMechanism,
};
