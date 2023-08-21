const error = require("./utils/service.error");
const { getUserInfo } = require("../utils/superagent");
const {
  mainCatDao,
  subCatDao,
  subCatReqDao,
} = require("./../models/category.dao.js");

const mainCatServ = {
  // ***
  retrieveAll: async () => {
    return await mainCatDao.retrieveAll();
  },
  // ***
  create: async (mainCatName) => {
    await error.checkDuplicates.forMain(mainCatName);
    await mainCatDao.create(mainCatName);
  },
  // ***
  update: async (mainCatId, newMainCatName) => {
    await mainCatDao.update(mainCatId, newMainCatName);
  },
  // ***
  delete: async (mainCatId) => {
    await mainCatDao.delete(mainCatId);
  },
};

const subCatServ = {
  // ***
  retrieveAll: async (mainCatId) => {
    return await subCatDao.retrieveAll(mainCatId);
  },
  // ***
  create: async (mainCatId, subCatName) => {
    await error.checkDuplicates.forSub(mainCatId, subCatName);
    await subCatDao.create(mainCatId, subCatName);
  },
  // ***
  update: async (subCatId, newSubCatName) => {
    await subCatDao.update(subCatId, newSubCatName);
  },
  // ***
  delete: async (subCatId) => {
    await subCatDao.delete(subCatId);
  },
};

const subCatReqServ = {
  // ***
  submit: async (mainCatId, subCatName, accountId) => {
    await error.checkDuplicates.forSub(mainCatId, subCatName);
    await error.checkDuplicates.forSubReq(mainCatId, subCatName);
    const userInfo = await getUserInfo(accountId);
    const { name, email } = userInfo;
    const mainCatName = await mainCatDao.getNameById(mainCatId);
    await subCatReqDao.create(mainCatId, mainCatName, subCatName, name, email);
  },
  // ***
  retrieveAll: async () => {
    return await subCatReqDao.retrieveAll();
  },
  // ***
  accept: async (subCatReqId) => {
    const subCatReq = await subCatReqDao.findSubCatReqById(subCatReqId);
    const { mainCatId, subCatName } = subCatReq;
    await subCatDao.create(mainCatId, subCatName);
    await subCatReqDao.delete(subCatReqId);
  },
  // ***
  deny: async (subCatReqId) => {
    await subCatReqDao.delete(subCatReqId);
  },
};

module.exports = { mainCatServ, subCatServ, subCatReqServ };
