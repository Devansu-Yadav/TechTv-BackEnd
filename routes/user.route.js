const express = require("express");
const userRouter = express.Router();
const { authVerify } = require("../middlewares/authVerify");
const { getLikedVideosHandler, addItemToLikedVideosHandler, removeItemFromLikedVideosHandler } = require("../controllers/likeVideos.controller");
const { getWatchLaterVideosHandler, addItemToWatchLaterHandler, removeItemFromWatchLaterHandler } = require("../controllers/watchLater.controller");

// routes related to user's liked videos
userRouter.route("/likes")
    .get(authVerify, getLikedVideosHandler)
    .post(authVerify, addItemToLikedVideosHandler);

userRouter.route("/likes/:videoId")
    .delete(authVerify, removeItemFromLikedVideosHandler);

// routes related to watchlater
userRouter.route("/watchlater")
    .get(authVerify, getWatchLaterVideosHandler)
    .post(authVerify, addItemToWatchLaterHandler);

userRouter.route("/watchlater/:videoId")
    .delete(authVerify, removeItemFromWatchLaterHandler);

module.exports = { userRouter };