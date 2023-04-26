const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts-controllers");
const { validateBody } = require("../../decorators");
const { isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.use(authenticate);

router.get("/", contactsController.listContacts);

router.get("/:contactId", isValidId, contactsController.getContactsById);

router.post(
  "/",
  validateBody(schemas.contactsAddSchema),
  contactsController.addContact
);

router.delete("/:contactId", isValidId, contactsController.removeContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.contactsAddSchema),
  contactsController.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.contactsUpdateFavoriteSchema),
  contactsController.updateStatusContact
);

module.exports = router;
