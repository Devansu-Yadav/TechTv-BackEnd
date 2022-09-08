const { Video } = require("../models/videos.model");
const mongoose = require("mongoose");

/**
 *  Publicly accessible routes for videos
 */

/**
 *  @apiName GET Videos
 *  @desc Get all videos
 *  @route /api/videos
 *  @returns {Video[]} A list of all videos
 */

const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find({});

        if(!videos) {
            return res.status(200).json({ videos: [] });
        }

        return res.json({ videos });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 *  @apiName GET video
 *  @desc Get a video
 *  @route /api/videos/:videoId
 *  @param {string} videoId Unique identifier for the specified video
 *  @returns {Video} A video specified by user
 */

const getVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const validId = mongoose.Types.ObjectId.isValid(videoId);

        if(validId) {
            const video = await Video.findById(videoId);

            if(video) {
                return res.json({ video });
            }
            return res.status(404).json({ success: false, message: "Cannot find video" });
        }
        return res.status(400).json({ success: false, message: "Bad Request. Invalid video id provided." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getAllVideos, getVideo };