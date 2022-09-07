const mongoose = require("mongoose");

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to Database successfully");
    } catch (err) {
        console.log("Failed to connect to DB");
    }
};

module.exports = {
    connectDB
};
