const { detectError } = require("./../utils/error");
const { AccessKey } = require("./Class/AccessKey");

const verifyUser = async (req, res, next) => {
  try {
    const accessKey = new AccessKey(req.headers.authorization);
    accessKey.checkExistence();
    [res.locals.accountId, res.locals.isAdmin] = await accessKey.decode();
    next();
  } catch (error) {
    next(error);
  }
};

const verifyUserOptionally = async (req, res, next) => {
  if (!req.headers.authorization) return next();
  try {
    const accessKey = new AccessKey(req.headers.authorization);
    [res.locals.accountId, res.locals.isAdmin] = await accessKey.decode();
    next();
  } catch (error) {
    next(error);
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const accessKey = new AccessKey(req.headers.authorization);
    accessKey.checkExistence();
    [res.locals.accountId, res.locals.isAdmin] = await accessKey.decode();
    if (!res.locals.isAdmin) detectError("ACCESS_NOT_ALLOWED_FOR_USER_ACCOUNT");
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyUser, verifyUserOptionally, verifyAdmin };
