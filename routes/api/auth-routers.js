const express = require("express");
const router = express.Router();

const { validateBody } = require("../../decorators");
const { schemas } = require("../../models/user");
const { authenticate, upload } = require("../../middlewares");

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

router.patch(
  "/",
  authenticate,
  validateBody(schemas.userSubscriptionSchema),
  authControllers.changeSubscription
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.changeAvatar
);

router.get("/verify/:verificationToken", authControllers.verify);
router.post(
  "/verify",
  validateBody(schemas.verifyEmailSchema),
  authControllers.reVerification
);

module.exports = router;
