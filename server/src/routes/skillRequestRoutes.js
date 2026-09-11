const express = require("express");
const {
  createSkillRequest,
} = require("../controllers/skillRequestController");

const router = express.Router();

router.post("/", createSkillRequest);

module.exports = router;