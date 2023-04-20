const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts-controllers");
const { validateBody } = require("../../decorators");
const { schemas } = require("../../models/contact");

router.get("/", contactsController.listContacts);

router.get("/:contactId", contactsController.getContactsById);

router.post(
  "/",
  validateBody(schemas.contactsAddSchema),
  contactsController.addContact
);

router.delete("/:contactId", contactsController.removeContact);

router.put(
  "/:contactId",
  validateBody(schemas.contactsAddSchema),
  contactsController.updateContact
);

module.exports = router;
