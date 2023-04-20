const { Schema, model, Error } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const contactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required name field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `missing required email field`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `missing required phone number field`,
  }),
  favorite: Joi.boolean(),
});

const schemas = {
  contactsAddSchema,
};

contactsSchema.post("save", handleMongooseError);

const Contact = model("contact", contactsSchema);

module.exports = { Contact, schemas };
