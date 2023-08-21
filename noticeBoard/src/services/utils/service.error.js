const { detectError } = require("../../utils/error.js");
const { duplicatesDao } = require("../../models/category.dao");
// ***
const checkTheAuthor = (accountId, contents) => {
  if (contents.accountId !== accountId) {
    detectError("Only the author of the content can edit/delete it", 400);
  }
};
// ***
const checkDuplicates = {
  forMain: async (mainCatName) => {
    const exists = await duplicatesDao.findMainCat(mainCatName);
    if (exists) {
      detectError(`Given main category already exists`, 400);
    }
  },
  forSub: async (mainCatId, subCatName) => {
    const exists = await duplicatesDao.findSubCat(mainCatId, subCatName);
    if (exists) {
      detectError(`Given subCategory already exists`, 400);
    }
  },
  forSubReq: async (mainCatId, subCatName) => {
    const exists = await duplicatesDao.findSubCatReq(mainCatId, subCatName);
    if (exists) {
      detectError(`Given subCategory request already exists`, 400);
    }
  },
};

module.exports = {
  checkTheAuthor,
  checkDuplicates,
};
