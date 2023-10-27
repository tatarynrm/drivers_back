const express = require("express");
const router = express.Router();
const validateForm = require("../validations/validateForm");
const pool = require("../db/pool");
const { rateLimiter } = require("../validations/rateLimiters");
const session = require("express-session");
const userController = require("../controllers/user-controller");
const errorMiddleware = require("../middlewares/error-middleware");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
// router.post("/refresh", userController.refresh);
router.post("/activate/:link", userController.refresh);
router.get("/refresh", userController.refresh);
router.post("/user", userController.getInfo);
router.post("/data", userController.getTwoYearInfo);
// authMiddleware,
module.exports = router;
// 6821