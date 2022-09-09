const { User } = require("../models/users.model");
const { Video } = require("../models/videos.model");
const mongoose = require("mongoose");

/**
 *  Private accessible routes for Watch Later Videos.
 *  Client needs to add "authorization" header with JWT token in it to access it.
 */

/**
 *  @apiName GET Watch Later videos
 *  @desc Get all videos in watch later
 *  @route /api/user/watchlater
 *  @returns {Video[]} A list of all watch later videos
 */

const getWatchLaterVideosHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const { watchlater } = foundUser;

        if(!watchlater || watchlater.length === 0) {
            return res.status(200).json({ watchlater: [] });
        }

        res.json({ watchlater });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 *  @apiName POST Add to Watch Later
 *  @desc Add video to watch later
 *  @route /api/user/watchlater
 *  @apiReqBody {video} body should contain video to be added
 *  @returns {Video[]} A list of all watch later videos
 */

const addItemToWatchLaterHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }
    
    const { video } = req.body;
    if(!video) {
        return res.status(400).json({ success: false, message: "Please provide video details to be added to watch later." });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const userWatchLater = foundUser.watchlater;
        const existsInWatchLater = userWatchLater.find(watchLaterVideo => watchLaterVideo._id === video._id) ? true: false;

        if(existsInWatchLater) {
            return res.status(403).json({ success: false, message: "Video already exists in watch later" });
        }

        userWatchLater.push({
            ...video,
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString())
        });
        const updatedUser = await User.updateOne({ _id: userId}, { watchlater: userWatchLater });

        return res.status(201).json({ watchlater: userWatchLater });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });   
    }
};

/**
 *  @apiName Delete Remove video from Watch Later
 *  @desc Remove a video from user's watch later
 *  @route /api/user/watchlater/:videoId
 *  @param {string} videoId Unique identifier for the specified video
 *  @returns {Video[]} A list of all videos in watch later
 */

const removeItemFromWatchLaterHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    const { videoId } = req.params;
    const validId = mongoose.Types.ObjectId.isValid(videoId);

    if(!validId) {
        return res.status(400).json({ success: false, message: "Invalid video id provided. Bad request error." });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        let userWatchLater = foundUser.watchlater;
        const existsInWatchLater = userWatchLater.find(watchLaterVideo => watchLaterVideo._id === videoId) ? true: false;

        if(!existsInWatchLater) {
            return res.status(404).json({ success: false, message: "Video does not exist in watch later" });
        }

        userWatchLater = userWatchLater.filter((item) => item._id !== videoId);
        const updatedUser = await User.updateOne({ _id: userId}, { watchlater: userWatchLater });

        return res.status(201).json({ watchlater: userWatchLater });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });         
    }
};

module.exports = { getWatchLaterVideosHandler, addItemToWatchLaterHandler, removeItemFromWatchLaterHandler };
