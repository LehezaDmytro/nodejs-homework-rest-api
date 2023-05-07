const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY, SENDGRID_FROM } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  await sgMail.send({
    ...data,
    from: SENDGRID_FROM,
  });
  return true;
};

module.exports = sendEmail;
