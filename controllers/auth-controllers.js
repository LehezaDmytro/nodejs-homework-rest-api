const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpError, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const { ctrlWrapper } = require("../decorators");
const gravatar = require("gravatar");
const path = require("path");
const jimp = require("jimp");
const { nanoid } = require("nanoid");

const avatarsDir = path.resolve("public", "avatars");

const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const heshPassword = await bcrypt.hash(password, 10);

  const newAvatar = gravatar.url(
    email,
    {
      s: 250,
      r: "pd",
      d: "retro",
    },
    true
  );

  const verificationToken = nanoid();
  const verifiLink = `${BASE_URL}/users/verify/${verificationToken}`;

  const data = {
    to: email,
    subject: "Veryfi email",
    html: `<a target="_blank" href="${verifiLink}">Click verify email</a>`,
  };

  const newUser = await User.create({
    ...req.body,
    password: heshPassword,
    avatarURL: newAvatar,
    verificationToken,
  });

  await sendEmail(data);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const changeSubscription = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });
  res.json({
    email,
    subscription,
  });
};

const changeAvatar = async (req, res) => {
  const { path: tmpUpload, filename } = req.file;
  const resultUpload = path.join(avatarsDir, filename);
  const image = await jimp.read(tmpUpload);
  await image.resize(250, 250, jimp.RESIZE_BEZIER);
  await image.writeAsync(tmpUpload);
  await fs.rename(tmpUpload, resultUpload);
  const avatar = path.join("avatars", filename);
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { avatarURL: avatar });

  res.json({
    avatarURL: avatar,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  res.status(200).json({
    message: "Verification successfu",
  });
};

const reVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email");
  }
  const user = await User.findOne({ email });
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifiLink = `${BASE_URL}/users/verify/${user.verificationToken}`;
  const data = {
    to: email,
    subject: "Veryfi email",
    html: `<a target="_blank" href="${verifiLink}">Click verify email</a>`,
  };
  await sendEmail(data);

  res.status(200).json({
    message: "Verification email sent",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  changeSubscription: ctrlWrapper(changeSubscription),
  changeAvatar: ctrlWrapper(changeAvatar),
  verify: ctrlWrapper(verify),
  reVerification: ctrlWrapper(reVerification),
};
