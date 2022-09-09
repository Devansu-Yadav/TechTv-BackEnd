const { User } = require("../models/users.model");
const { Video } = require("../models/videos.model");
const mongoose = require("mongoose");

/**
 *  Private accessible routes for watch history.
 *  Client needs to add "authorization" header with JWT token in it to access it.
 */

/**
 *  @apiName GET videos in history
 *  @desc Get all videos in watch history
 *  @route /api/user/history
 *  @returns {Video[]} A list of all videos in watch history
 */

const getWatchHistoryHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const { history } = foundUser;

        if(!history || history.length === 0) {
            return res.status(200).json({ history: [] });
        }

        res.json({ history });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 *  @apiName POST Add to watch history
 *  @desc Add video to watch history
 *  @route /api/user/history
 *  @apiReqBody {video} body should contain video to be added
 *  @returns {Video[]} A list of all videos in watch history
 */

const addItemToWatchHistoryHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }
    
    const { video } = req.body;
    if(!video) {
        return res.status(400).json({ success: false, message: "Please provide video details to be added to watch history." });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const userWatchHistory = foundUser.history;
        const existsInWatchHistory = userWatchHistory.find(watchHistoryVideo => watchHistoryVideo._id === video._id) ? true: false;

        if(existsInWatchHistory) {
            return res.status(403).json({ success: false, message: "Video already exists in watch history." });
        }

        userWatchHistory.push({
            ...video,
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString())
        });
        const updatedUser = await User.updateOne({ _id: userId}, { history: userWatchHistory });

        return res.status(201).json({ history: userWatchHistory });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });   
    }
};

/**
 *  @apiName Delete Remove video from Watch History
 *  @desc Remove a video from user's watch history
 *  @route /api/user/history/:videoId
 *  @param {string} videoId Unique identifier for the specified video
 *  @returns {Video[]} A list of all videos in watch history
 */

const removeItemFromWatchHistoryHandler = async (req, res) => {
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
        let userWatchHistory = foundUser.history;
        const existsInWatchHistory = userWatchHistory.find(watchHistoryVideo => watchHistoryVideo._id === videoId) ? true: false;

        if(!existsInWatchHistory) {
            return res.status(404).json({ success: false, message: "Video does not exist in watch history." });
        }

        userWatchHistory = userWatchHistory.filter((item) => item._id !== videoId);
        const updatedUser = await User.updateOne({ _id: userId}, { history: userWatchHistory });

        return res.status(201).json({ history: userWatchHistory });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });         
    }
};

/**
 *  @apiName Delete Remove all videos from Watch History
 *  @desc Remove all videos from user's watch history
 *  @route /api/user/history
 *  @returns {Video[]} A list of all videos in watch history
 */

 const clearWatchHistoryHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    try {
        const updatedUser = await User.updateOne({ _id: userId}, { history: [] });

        return res.status(200).json({ history: [] });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });         
    }
};

module.exports = { getWatchHistoryHandler, addItemToWatchHistoryHandler, removeItemFromWatchHistoryHandler, clearWatchHistoryHandler };
