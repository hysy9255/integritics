const mongoose = require("mongoose");
const { postSchema, viewRecords } = require("../schemas/post.schema");
const ObjectId = mongoose.Types.ObjectId;
const { generateSort } = require("./utils/dao.functions");

const Post = mongoose.model("post", postSchema);
const ViewRecords = mongoose.model("viewRecords", viewRecords);
// ***
const createAPost = async (accountId, requestData) => {
  const { mainCatId, subCatId, title, contents } = requestData;
  try {
    await Post.create({
      accountId,
      mainCatId,
      subCatId,
      title,
      contents,
    });
  } catch (error) {
    throw error;
  }
};
// ***
const retrievePosts = async (requestData) => {
  // const { subCatId, orderBy, method } = requestData;
  // const sort = generateSort(orderBy, method);
  const { mainCatId, subCatId } = requestData;
  let { page } = requestData;

  if (page === undefined) {
    page = 1;
  }

  const limit = 5;
  const skip = 5 * (page - 1);

  const match = {};
  if (mainCatId) {
    match.mainCatId = mainCatId;
  }
  if (subCatId) {
    match.subCatId = subCatId;
  }
  const agg = [
    { $match: match },
    {
      $addFields: { postId: "$_id" },
    },
    {
      $sort: { createdAt: -1 },
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
              mainCatId: 1,
              subCatId: 1,
              accountId: 1,
              postId: 1,
              title: 1,
              createdAt: 1,
              updatedAt: 1,
              views: 1,
            },
          },
        ],
      },
    },
  ];
  try {
    const [result] = await Post.aggregate(agg);
    return result;
  } catch (error) {
    throw error;
  }
};
// ***
const retrieveUserPosts = async (accountId, page) => {
  if (page === undefined) {
    page = 1;
  }

  const limit = 5;
  const skip = 5 * (page - 1);

  const agg = [
    { $match: { accountId } },
    {
      $addFields: { postId: "$_id" },
    },
    {
      $sort: { createdAt: -1 },
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
              mainCatId: 1,
              subCatId: 1,
              accountId: 1,
              postId: 1,
              title: 1,
              createdAt: 1,
              updatedAt: 1,
              views: 1,
            },
          },
        ],
      },
    },
  ];
  try {
    const [result] = await Post.aggregate(agg);
    return result;
  } catch (error) {
    throw error;
  }
};

const retrieveMyPosts = async (accountId, page) => {
  if (page === undefined) {
    page = 1;
  }

  const limit = 5;
  const skip = 5 * (page - 1);

  const agg = [
    { $match: { accountId } },
    {
      $addFields: { postId: "$_id" },
    },
    {
      $sort: { createdAt: -1 },
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
              mainCatId: 1,
              subCatId: 1,
              accountId: 1,
              postId: 1,
              title: 1,
              createdAt: 1,
              updatedAt: 1,
              views: 1,
            },
          },
        ],
      },
    },
  ];
  try {
    const [result] = await Post.aggregate(agg);
    return result;
  } catch (error) {
    throw error;
  }
};
// ***
const retrieveAPost = async (postId) => {
  try {
    const agg = [
      { $match: { _id: ObjectId(postId) } },
      { $addFields: { postId: "$_id" } },
      {
        $project: {
          _id: 0,
          mainCatId: 0,
          __v: 0,
        },
      },
    ];
    return await Post.aggregate(agg);
  } catch (error) {
    throw error;
  }
};
// ***
const updateViews = async (postId) => {
  try {
    const post = await Post.findById(postId);
    post.views = post.views + 1;
    await post.save();
  } catch (error) {
    throw error;
  }
};
// ***
const updateAPost = async (requestData) => {
  const { postId, newTitle, newContents } = requestData;
  try {
    const post = await Post.findById(postId);
    post.title = newTitle;
    post.contents = newContents;
    await post.save();
  } catch (error) {
    throw error;
  }
};
// ***
const deleteAPost = async (postId) => {
  try {
    await Post.deleteOne({ _id: postId });
  } catch (error) {
    throw error;
  }
};

const getPostAuthorId = async (postId) => {
  const agg = [
    { $match: { _id: ObjectId(postId) } },
    { $project: { accountId: 1 } },
  ];
  try {
    const [data] = await Post.aggregate(agg);
    return data.accountId;
  } catch (error) {
    throw error;
  }
};

const insertViewRecords = async (postId, ip, userId) => {
  console.log(userId, ip, postId);
  try {
    await ViewRecords.create({ postId, ip, userId });
  } catch (error) {
    throw error;
  }
};

const checkViewRecords = async (postId, ip, userId) => {
  let agg;
  if (userId === undefined) {
    agg = [{ $match: { postId, ip } }];
  } else {
    agg = [{ $match: { postId, userId } }];
  }
  try {
    const record = await ViewRecords.aggregate(agg);
    return record;
  } catch (error) {
    throw error;
  }
};

const retrieveTopViewPosts = async () => {
  const agg = [{ $sort: { views: -1 } }, { $limit: 5 }];
  try {
    return await Post.aggregate(agg);
  } catch (error) {
    throw error;
  }
};

const retrievePostsByPostIds = async (postIds) => {
  const agg = [
    { $match: { _id: { $in: postIds } } },
    { $addFields: { postId: "$_id" } },
    {
      $project: {
        _id: 0,
        postId: 1,
        accountId: 1,
        title: 1,
        views: 1,
        createdAt: 1,
      },
    },
  ];
  try {
    return await Post.aggregate(agg);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  retrievePosts,
  retrieveUserPosts,
  createAPost,
  retrieveAPost,
  updateViews,
  updateAPost,
  deleteAPost,
  getPostAuthorId,
  checkViewRecords,
  insertViewRecords,
  retrieveTopViewPosts,
  retrievePostsByPostIds,
  retrieveMyPosts,
};
