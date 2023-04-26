const express = require("express");
const router = express.Router();

const { validateBody } = require("../../decorators");
const { schemas } = require("../../models/user");
const { authenticate } = require("../../middlewares");

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

router.get("/current", authenticate, authControllers.getCurrent);

router.post("/logout", authenticate, authControllers.logout);

module.exports = router;
