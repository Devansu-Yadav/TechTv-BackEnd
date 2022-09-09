const { User } = require("../models/users.model");
const { Video } = require("../models/videos.model");
const mongoose = require("mongoose");
const mongo = require("mongodb");

/**
 *  Private accessible routes for Playlist.
 *  Client needs to add "authorization" header with JWT token in it to access it.
 */

/**
 *  @apiName GET Playlists
 *  @desc Get all playlists
 *  @route /api/user/playlists
 *  @returns {Array} A list of all playlists
 */

const getPlaylistsHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const { playlists } = foundUser;

        if(!playlists || playlists.length === 0) {
            return res.status(200).json({ playlists: [] });
        }

        res.json({ playlists });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 *  @apiName POST Add a playlist
 *  @desc Add a playlist to user's playlists
 *  @route /api/user/playlists
 *  @apiReqBody {playlist} body should contain playlist to be added {playlist: {title: "foo", description:"bar bar bar" }}
 *  @returns {Array} A list of all playlists
 */

const addNewPlaylistHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }
    
    const { playlist } = req.body;
    if(!playlist || !playlist.title) {
        return res.status(400).json({ success: false, message: "Please provide playlist details including title to be added to playlists." });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const userPlaylists = foundUser.playlists;
        const existsInPlaylists = userPlaylists.find(userPlaylist => userPlaylist.title === playlist.title) ? true: false;

        if(existsInPlaylists) {
            return res.status(403).json({ success: false, message: "Playlist with this title already exists in user's playlists." });
        }

        userPlaylists.push({
            ...playlist,
            _id: mongo.ObjectId().toString(),
            videos: [],
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString())
        });
        
        const updatedUser = await User.updateOne({ _id: userId}, { playlists: userPlaylists });

        return res.status(201).json({ playlists: userPlaylists });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });   
    }
};

/**
 *  @apiName Delete Removes a playlist
 *  @desc Remove a playlist from user's playlists
 *  @route /api/user/playlists/:playlistId
 *  @param {string} playlistId Unique identifier for the specified playlist
 *  @returns {Array} A list of all playlists
 */

const removePlaylistHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    const { playlistId } = req.params;
    const validId = mongoose.Types.ObjectId.isValid(playlistId);

    if(!validId) {
        return res.status(400).json({ success: false, message: "Invalid playlist id provided. Bad request error." });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        let userPlaylists = foundUser.playlists;
        const existsInPlaylists = userPlaylists.find(userPlaylist => userPlaylist._id === playlistId) ? true: false;

        if(!existsInPlaylists) {
            return res.status(404).json({ success: false, message: "Playlist does not exist in user's playlists" });
        }

        userPlaylists = userPlaylists.filter((item) => item._id !== playlistId);
        const updatedUser = await User.updateOne({ _id: userId}, { playlists: userPlaylists });

        return res.status(201).json({ playlists: userPlaylists });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });         
    }
};

/**
 *  @apiName GET Videos from Playlist
 *  @desc Get all videos from a playlist
 *  @route /api/user/playlists/:playlistId
 *  @param {string} playlistId Unique identifier for the specified playlist
 *  @returns {Object} A playlist from user's playlists
 */

const getVideosFromPlaylistHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    const { playlistId } = req.params;
    const validId = mongoose.Types.ObjectId.isValid(playlistId);

    if(!validId) {
        return res.status(400).json({ success: false, message: "Invalid playlist id provided. Bad request error." });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const { playlists } = foundUser;
        const playlist = playlists.find(playList => playList._id === playlistId);

        if(!playlist) {
            return res.status(404).json({ success: false, message: "Playlist does not exist in user's playlists" });
        }

        res.json({ playlist });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 *  @apiName POST Add video to playlist
 *  @desc Add video to a playlist in user's playlists
 *  @route /api/user/playlists/:playlistId
 *  @param {string} playlistId Unique identifier for the specified playlist
 *  @apiReqBody {video} body should contain video to be added
 *  @returns {Object} A list of all videos in the specified playlist
 */

 const addVideoToPlaylistHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    const { playlistId } = req.params;
    const validId = mongoose.Types.ObjectId.isValid(playlistId);

    if(!validId) {
        return res.status(400).json({ success: false, message: "Invalid playlist id provided. Bad request error." });
    }
    
    const { video } = req.body;
    if(!video) {
        return res.status(400).json({ success: false, message: "Please provide video details to be added to the specified playlist." });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        const userPlaylists = foundUser.playlists;
        const playlist = userPlaylists.find(playList => playList._id === playlistId);

        if(!playlist) {
            return res.status(404).json({ success: false, message: "Playlist does not exist in user's playlists" });
        }

        const existsInPlaylist = playlist.videos.some((item) => item._id === video._id);
        if(existsInPlaylist) {
            return res.status(403).json({ success: false, message: "Video already exists in playlist." });
        }

        playlist.videos.push({
            ...video,
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString())
        });

        const updatedUser = await User.updateOne({ _id: userId}, { playlists: userPlaylists });

        return res.status(201).json({ playlists: userPlaylists });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });   
    }
};

/**
 *  @apiName Delete Remove video from playlist
 *  @desc Remove a video from user's playlist
 *  @route /api/user/playlists/:playlistId/:videoId
 *  @param {string} playlistId Unique identifier for the specified playlist
 *  @param {string} videoId Unique identifier for the specified video
 *  @returns {Object} A list of all videos in the specified playlist
 */

 const removeVideoFromPlaylistHandler = async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        return res.status(404).json({ success: false, message: "The email you entered is not Registered. Not Found error" });
    }

    const { playlistId } = req.params;
    const validPlaylistId = mongoose.Types.ObjectId.isValid(playlistId);

    if(!validPlaylistId) {
        return res.status(400).json({ success: false, message: "Invalid playlist id provided. Bad request error." });
    }

    const { videoId } = req.params;
    const validVideoId = mongoose.Types.ObjectId.isValid(videoId);

    if(!validVideoId) {
        return res.status(400).json({ success: false, message: "Invalid video id provided. Bad request error." });
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        let userPlaylists = foundUser.playlists;
        const playlist = userPlaylists.find(playList => playList._id === playlistId);
        
        if(!playlist) {
            return res.status(404).json({ success: false, message: "Playlist does not exist in user's playlists" });
        }

        const existsInPlaylist = playlist.videos.some((item) => item._id === videoId);
        if(!existsInPlaylist) {
            return res.status(404).json({ success: false, message: "Video does not exist in the specified playlist." });
        }

        playlist.videos = playlist.videos.filter((item) => item._id !== videoId);
        const updatedUser = await User.updateOne({ _id: userId}, { playlists: userPlaylists });

        return res.status(201).json({ playlists: userPlaylists });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });         
    }
};

module.exports = { getPlaylistsHandler, addNewPlaylistHandler, removePlaylistHandler, getVideosFromPlaylistHandler, addVideoToPlaylistHandler, removeVideoFromPlaylistHandler };
