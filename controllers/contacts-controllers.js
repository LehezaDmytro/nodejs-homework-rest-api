const { HttpError } = require("../helpers");
const contactsServices = require("../models/contacts");
const { ctrlWrapper } = require("../decorators");

const listContacts = async (req, res) => {
  const result = await contactsServices.listContacts();
  res.json(result);
};

const getContactsById = async (req, res) => {
  const { contactId } = req.params;
  const result = await contactsServices.getContactById(contactId);
  if (!result) {
    throw HttpError(404, `Contact width id:${contactId} not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const result = await contactsServices.addContact(req.body);
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contactsServices.removeContact(contactId);
  if (!result) {
    throw HttpError(404, `Contact width id:${contactId} not found`);
  }
  res.json({
    message: "contact deleted",
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contactsServices.updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, `Contact width id:${contactId} not found`);
  }
  res.json(result);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactsById: ctrlWrapper(getContactsById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
};
