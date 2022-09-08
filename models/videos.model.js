const mongoose = require("mongoose");
const { Schema } = mongoose;

const videoSchema = new Schema({
    _id: String,
    title: String,
    videoUrl: String,
    categoryName: String,
    viewCount: Number,
    uploadDate: Date,
    description: String
});

const Video = mongoose.model("Video", videoSchema);

module.exports = { Video };