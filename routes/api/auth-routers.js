const express = require("express");
const router = express.Router();

const { validateBody } = require("../../decorators");
const { schemas } = require("../../models/user");

const authControllers = require("../../controllers/auth-controllers");

router.post(
  "/register",
  validateBody(schemas.userRegisterSchema),
  authControllers.register
);

router.post(
  "/login",
  validateBody(schemas.userLoginSchema),
  authControllers.login
);
module.exports = router;
