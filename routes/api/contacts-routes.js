const express = require("express");

const router = express.Router();

const contactsController = require("../../controllers/contacts-controllers");

const { validateBody } = require("../../decorators");

const shemas = require("../../shemas/contacts");

router.get("/", contactsController.listContacts);

router.get("/:contactId", contactsController.getContactsById);

router.post(
  "/",
  validateBody(shemas.contactsAddSchema),
  contactsController.addContact
);

router.delete("/:contactId", contactsController.removeContact);

router.put(
  "/:contactId",
  validateBody(shemas.contactsAddSchema),
  contactsController.updateContact
);

module.exports = router;
