const express = require("express");
const { getCargos } = require("../controllers/cargo");
const router = express.Router();

router.route("/cargo").get(getCargos);
// router.route("/cargo/repeat").post(repeatMyCargo);

module.exports = router;
