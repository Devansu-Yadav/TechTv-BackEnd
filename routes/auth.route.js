const express = require("express");
const authRouter = express.Router();
const { signupHandler, loginHandler, passwordResetHandler } = require("../controllers/auth.controller");

// routes related to auth
authRouter.route("/signup")
    .post(signupHandler);

authRouter.route("/login")
    .post(loginHandler);

authRouter.route("/passwordReset")
    .post(passwordResetHandler);

module.exports = { authRouter };