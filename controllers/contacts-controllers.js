const { HttpError, sendMail, sendEmail } = require("../helpers");
const { Contact } = require("../models/contact");
const { ctrlWrapper } = require("../decorators");

const listContacts = async (req, res) => {
  const owner = req.user._id;
  const { page = 1, limit = 10, favorite = false } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "", { skip, limit }).all(
    "favorite",
    favorite
  );

  res.json(result);
};

const getContactsById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, `Contact width id:${contactId} not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const owner = req.user._id;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404, `Contact width id:${contactId} not found`);
  }
  res.json({
    message: "contact deleted",
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact width id:${contactId} not found`);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
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
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
