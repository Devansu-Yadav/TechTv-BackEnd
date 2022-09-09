const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getEncodedToken = (_id) => {
    const token = jwt.sign({ _id }, process.env.AUTH_SECRET);
    return token;
};

const getDecodedDataFromToken = (token) => {
    const data = jwt.verify(token, process.env.AUTH_SECRET);
    return data;
};

const getHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
};

const isValidPassword = async (password, storedPassword) => {
    const validPassword = await bcrypt.compare(password, storedPassword);
    return validPassword;
}

module.exports = { getEncodedToken, getDecodedDataFromToken, getHashedPassword, isValidPassword };