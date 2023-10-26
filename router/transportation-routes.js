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
const transportationController = require("../controllers/transportation-controller");

router.post("/transportation", transportationController.transportation);
router.get("/zap", transportationController.allZap);


module.exports = router;
