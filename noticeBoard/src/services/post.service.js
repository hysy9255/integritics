const postDao = require("../models/post.dao");
const likeDao = require("../models/like.dao");
const error = require("./utils/service.error");
const { ObjectId } = require("mongodb");
const {
  cookRetrievedPosts,
  updateViewMechanism,
} = require("./utils/service.functions");
const { getUserInfo, getUserNames } = require("../utils/superagent");
// ***
const createAPost = async (accountId, requestData) => {
  await postDao.createAPost(accountId, requestData);
};
// ***
const retrievePosts = async (requestData) => {
  const result = await postDao.retrievePosts(requestData);
  const posts = result.paginatedResults;
  if (result.totalCount.length === 0) {
    return { totalCount: 0, data: [] };
  }
  const totalCount = result.totalCount[0].total;
  const data = await cookRetrievedPosts(posts);

  return { totalCount, data };
};
// ***
const retrieveUserPosts = async (accountId, page) => {
  const result = await postDao.retrieveUserPosts(accountId, page);
  const posts = result.paginatedResults;
  if (result.totalCount.length === 0) {
    return { totalCount: 0, data: [] };
  }
  const totalCount = result.totalCount[0].total;
  const data = await cookRetrievedPosts(posts);

  return { totalCount, data };
};
const retrieveMyPosts = async (myAccountId, page) => {
  const result = await postDao.retrieveMyPosts(myAccountId, page);
  const posts = result.paginatedResults;
  if (result.totalCount.length === 0) {
    return { totalCount: 0, data: [] };
  }
  const totalCount = result.totalCount[0].total;
  const data = await cookRetrievedPosts(posts);

  return { totalCount, data };
};

// ***
const retrieveAPost = async (postId, ip, loggedInUserId) => {
  await updateViewMechanism(postId, ip, loggedInUserId);
  // <--- post 객체 --->
  // 게시물과 그에 해당되는 좋아요 가져오기
  const [post] = await postDao.retrieveAPost(postId);
  const [likes] = await likeDao.retrieveLikesForAPost(postId);
  if (likes === undefined) {
    post.likes = 0;
    post.usersWhoLiked = [];
  } else {
    const userNames = await getUserNames(likes.users);
    post.likes = likes.count;
    post.usersWhoLiked = userNames;
  }

  // // <--- author 객체 --->
  // // auth 서버로부터 게시물 작성자의 정보를 가져오기
  const authorId = post.accountId;
  delete post.accountId;
  const author = await getUserInfo(authorId.toString());
  author.authorId = authorId;

  // // <--- user 객체 --->
  // // 로그인한 현 사용자가 해당 게시물에 좋아요를 눌렀는지 확인
  const user = {};
  const likeExists = await likeDao.findALike(loggedInUserId, postId, "post");
  user.likeStatus = likeExists ? true : false;
  // 로그인한 현 사용자와 게시물의 작성자와 일치하면 게시물 수정 가능
  const allowed = { deleteAllowed: true, modifyAllowed: true };
  const disallowed = { deleteAllowed: false, modifyAllowed: false };
  !loggedInUserId
    ? Object.assign(user, disallowed)
    : loggedInUserId !== authorId
    ? Object.assign(user, disallowed)
    : Object.assign(user, allowed);

  return { post, author, user };
};
// ***
const updateAPost = async (accountId, requestData) => {
  const { postId } = requestData;
  const [post] = await postDao.retrieveAPost(postId);
  error.checkTheAuthor(accountId, post);
  await postDao.updateAPost(requestData);
};
// ***
const deleteAPost = async (isAdmin, postId, accountId) => {
  const [post] = await postDao.retrieveAPost(postId);
  if (!isAdmin) error.checkTheAuthor(accountId, post);
  await postDao.deleteAPost(postId);
};

const retrieveTopPosts = async () => {
  const topViewPosts = await postDao.retrieveTopViewPosts();

  const likes = await likeDao.retrieveTopLikes();
  const postIds = likes.map((doc) => new ObjectId(doc.postId));
  const topLikePostsRaw = await postDao.retrievePostsByPostIds(postIds);
  let merged = [];
  for (let i = 0; i < topLikePostsRaw.length; i++) {
    merged.push({
      ...topLikePostsRaw[i],
      ...likes.find(
        (doc) => doc.postId === topLikePostsRaw[i].postId.toString()
      ),
    });
  }
  const topLikePosts = merged;
  return { topViewPosts, topLikePosts };
};

module.exports = {
  retrievePosts,
  retrieveUserPosts,
  updateAPost,
  deleteAPost,
  createAPost,
  retrieveAPost,
  retrieveTopPosts,
  retrieveMyPosts,
};
