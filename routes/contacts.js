const express = require("express");
const {
  createContact,
  fetchContactById,
  markSpam,
} = require("../controllers/contacts");

const contactsRouter = express.Router();

contactsRouter.get("/:id", fetchContactById);
contactsRouter.post("/", createContact);
contactsRouter.patch("/mark-spam", markSpam);

module.exports = { contactsRouter };
