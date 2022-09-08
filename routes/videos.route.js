const express = require("express");
const videosRouter = express.Router();
const { getAllVideos, getVideo } = require("../controllers/videos.controller");

// routes related to videos
videosRouter.route("/")
    .get(getAllVideos);

videosRouter.route("/:videoId")
    .get(getVideo);

module.exports = { videosRouter };