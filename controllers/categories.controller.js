const { VideoCategory } = require("../models/categories.model");
const mongoose = require("mongoose");

/**
 *  Publicly accessible routes for video categories
 */

/**
 *  @apiName GET video categories
 *  @desc Get all video categories
 *  @route /api/categories
 *  @returns {VideoCategory[]} A list of all video categories
 */

const getAllVideoCategories = async (req, res) => {
    try {
        const categories = await VideoCategory.find({});

        if(!categories) {
            return res.status(200).json({ categories: [] });
        }

        return res.json({ categories });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 *  @apiName GET video category
 *  @desc Get a video category
 *  @route /api/categories/:categoryId
 *  @param {string} categoryId Unique identifier for the specified video category
 *  @returns {VideoCategory} A video category specified by user
 */

const getVideoCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const validId = mongoose.Types.ObjectId.isValid(categoryId);

        if(validId) {
            const category = await VideoCategory.findById(categoryId);

            if(category) {
                return res.json({ category });
            }
            return res.status(404).json({ success: false, message: "Cannot find video category. Not Found error." });
        }

        return res.status(400).json({ success: false, message: "Invalid video category id provided. Bad Request error." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getAllVideoCategories, getVideoCategory };
