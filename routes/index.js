require("dotenv").config();
const express = require("express");
const { usersRouter } = require("./users");
const { contactsRouter } = require("./contacts");
const { searchRouter } = require("./search");
const { authenticateUser } = require("../middleware/authenticate");

const router = express.Router();

router.use("/users", usersRouter);

router.use("/contacts", authenticateUser);
router.use("/search", authenticateUser);

router.use("/contacts", contactsRouter);
router.use("/search", searchRouter);

module.exports = { router };
