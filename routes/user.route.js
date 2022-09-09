const express = require("express");
const userRouter = express.Router();
const { authVerify } = require("../middlewares/authVerify");
const { getLikedVideosHandler, addItemToLikedVideosHandler, removeItemFromLikedVideosHandler } = require("../controllers/likeVideos.controller");
const { getWatchLaterVideosHandler, addItemToWatchLaterHandler, removeItemFromWatchLaterHandler } = require("../controllers/watchLater.controller");
const { getWatchHistoryHandler, addItemToWatchHistoryHandler, removeItemFromWatchHistoryHandler, clearWatchHistoryHandler } = require("../controllers/watchHistory.controller");
const { getPlaylistsHandler, addNewPlaylistHandler, removePlaylistHandler, getVideosFromPlaylistHandler, addVideoToPlaylistHandler, removeVideoFromPlaylistHandler } = require("../controllers/playlist.controller");

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

// routes related to watch history
userRouter.route("/history")
    .get(authVerify, getWatchHistoryHandler)
    .post(authVerify, addItemToWatchHistoryHandler)
    .delete(authVerify, clearWatchHistoryHandler);

userRouter.route("/history/:videoId")
    .delete(authVerify, removeItemFromWatchHistoryHandler);

// routes related to playlist
userRouter.route("/playlists")
    .get(authVerify, getPlaylistsHandler)
    .post(authVerify, addNewPlaylistHandler);

userRouter.route("/playlists/:playlistId")
    .delete(authVerify, removePlaylistHandler)
    .get(authVerify, getVideosFromPlaylistHandler)
    .post(authVerify, addVideoToPlaylistHandler);

userRouter.route("/playlists/:playlistId/:videoId")
    .delete(authVerify, removeVideoFromPlaylistHandler);

module.exports = { userRouter };