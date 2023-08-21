const express = require("express");
const { uploadImage } = require("./../controllers/image.controller.js");
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("File is not the correct type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000 },
});

const userRouter = express.Router();

userRouter.post("", upload.array("file"), uploadImage); // ***

module.exports = userRouter;
