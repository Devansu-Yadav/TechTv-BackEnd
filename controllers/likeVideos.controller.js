const { User } = require("../models/users.model");
const { Video } = require("../models/videos.model");
const mongoose = require("mongoose");

/**
 *  Private accessible routes for Liked Videos.
 *  Client needs to add "authorization" header with JWT token in it to access it.
 */

/**
 *  @apiName GET Liked videos
 *  @desc Get all liked videos
 *  @route /api/user/likes
 *  @returns {Video[]} A list of all liked videos
 */

const getLikedVideosHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const { likes } = foundUser;

        if(!likes || likes.length === 0) {
            return res.status(200).json({ likes: [] });
        }

        res.json({ likes });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 *  @apiName POST Add to Liked Videos
 *  @desc Add video to liked videos
 *  @route /api/user/likes
 *  @apiReqBody {video} body should contain video to be added
 *  @returns {Video[]} A list of all liked videos
 */

const addItemToLikedVideosHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }
    
    const { video } = req.body;
    if(!video) {
        return res.status(400).json({ success: false, message: "Please provide video details to be added to liked videos." });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const userLikedVideos = foundUser.likes;
        const existsInLikedVideos = userLikedVideos.find(likedVideo => likedVideo._id === video._id) ? true: false;

        if(existsInLikedVideos) {
            return res.status(403).json({ success: false, message: "Video already exists in liked videos" });
        }

        userLikedVideos.push({
            ...video,
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString())
        });
        const updatedUser = await User.updateOne({ _id: userId}, { likes: userLikedVideos });

        return res.status(201).json({ likes: userLikedVideos });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });   
    }
};

/**
 *  @apiName Delete Remove video from Liked Videos
 *  @desc Remove a video from user's liked videos
 *  @route /api/user/likes/:videoId
 *  @param {string} videoId Unique identifier for the specified video
 *  @returns {Video[]} A list of all videos in liked videos
 */

const removeItemFromLikedVideosHandler = async (req, res) => {
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
        let userLikedVideos = foundUser.likes;
        const existsInLikedVideos = userLikedVideos.find(likedVideo => likedVideo._id === videoId) ? true: false;

        if(!existsInLikedVideos) {
            return res.status(404).json({ success: false, message: "Video does not exist in liked videos" });
        }

        userLikedVideos = userLikedVideos.filter((item) => item._id !== videoId);
        const updatedUser = await User.updateOne({ _id: userId}, { likes: userLikedVideos });

        return res.status(201).json({ likes: userLikedVideos });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });         
    }
};

module.exports = { getLikedVideosHandler, addItemToLikedVideosHandler, removeItemFromLikedVideosHandler };
