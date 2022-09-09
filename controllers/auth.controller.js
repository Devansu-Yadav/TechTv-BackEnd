const { User } = require("../models/users.model");
const mongo = require("mongodb");
const { getEncodedToken, getHashedPassword, isValidPassword } = require("../helpers/authUtils");

/**
 * Publicly accessible routes for authentication
 */

/**
 * @apiName POST Signup user
 * @desc Handle user signup
 * @route /api/auth/signup
 * @apiReqBody {firstName, lastName, email, password}
 * @returns {Object} {User, token}
 */

const signupHandler = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the user info fields to signup!" });
        }

        const foundUser = await User.findOne({ email });
        
        if(foundUser) {
            return res.status(422).json({ success: false, message: "Unprocessable Entity. Email Already Exists." });
        }

        const hashedPassword = await getHashedPassword(password);

        const newUser = new User({
            _id: mongo.ObjectId().toString(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            likes: [],
            watchlater: [],
            history: [],
            playlists: [],
            createdAt: new Date(new Date().toISOString()),
            updatedAt: new Date(new Date().toISOString()),
        });

        const createdUser = await newUser.save();
        const token = getEncodedToken(createdUser._id);

        return res.status(201).json({ createdUser, token });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @apiName POST Login user
 * @desc Handle user login
 * @route /api/auth/login
 * @apiReqBody {email, password}
 * @returns {Object} {User, token}
 */

const loginHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        if(!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the user info fields to login!" });
        }

        const foundUser = await User.findOne({ email });
        if(!foundUser) {
            return res.status(404).json({ success: false, message: "The email you entered is not Registered. Please Sign up!"});
        }

        const validPassword = await isValidPassword(password, foundUser.password);
        if(validPassword) {
            const token = getEncodedToken(foundUser._id);
            return res.status(200).json({ foundUser, token });
        }

        return res.status(401).json({ success: false, message: "The credentials you entered are invalid. Unauthorized access error." });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @apiName POST Reset user password
 * @desc Handle user password reset
 * @route /api/auth/passwordReset
 * @apiReqBody {email, password}
 * @returns {Object} {User}
 */

const passwordResetHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        if(!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields to reset password!" });
        }

        const foundUser = await User.findOne({ email });
        if(!foundUser) {
            return res.status(404).json({ success: false, message: "The email you entered is not Registered. Please Sign up!"});
        }

        const hashedPassword = await getHashedPassword(password);
        foundUser.password = hashedPassword;

        const updatedUser = await User.findOneAndUpdate({ email }, { password: hashedPassword, updatedAt: new Date(new Date().toISOString()) });
        return res.status(200).json({ foundUser });
    } catch(err) {
        return res.status(500).json({ success: false, message: err.message });     
    }
};

module.exports = { signupHandler, loginHandler, passwordResetHandler };
