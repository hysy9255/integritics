const express = require("express");
const userRouter = require("./user.router.js");
const adminRouter = require("./admin.router.js");
const tokenRouter = require("./token.router.js");
const infoRouter = require("./info.router.js");
const userpageRouter = require("./userpage.router.js");
const imageRouter = require("./image.router.js");

const routes = express.Router();
routes.use("/auth/user", userRouter); // ***
routes.use("/auth/admin", adminRouter);
routes.use("/auth/token", tokenRouter); // ***
routes.use("/auth/userInfo", infoRouter);
routes.use("/userpage", userpageRouter);
routes.use("/image/upload", imageRouter);

module.exports = routes;
