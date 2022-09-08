const express = require("express");
const videoCategoryRouter = express.Router();
const { getAllVideoCategories, getVideoCategory } = require("../controllers/categories.controller");

// routes related to video categories
videoCategoryRouter.route("/")
    .get(getAllVideoCategories);

videoCategoryRouter.route("/:categoryId")
    .get(getVideoCategory);

module.exports = { videoCategoryRouter };