const mongoose = require("mongoose");
const { Schema } = mongoose;

const videoCategorySchema = new Schema({
    _id: String,
    categoryName: String,
    description: String
});

const VideoCategory = mongoose.model("Category", videoCategorySchema);

module.exports = { VideoCategory };