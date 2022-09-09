const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    createdAt: Date,
    updatedAt: Date,
    likes: Array,
    watchlater: Array,
    history: Array,
    playlists: Array
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
