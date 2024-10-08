const express = require("express");
const { searchByName, searchByPhone } = require("../controllers/search");

const searchRouter = express.Router();

searchRouter.get("/name", searchByName);
searchRouter.get("/phone", searchByPhone);

module.exports = { searchRouter };
