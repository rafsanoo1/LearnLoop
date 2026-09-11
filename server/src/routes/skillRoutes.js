const express = require("express");
const {
  getSkills,
  createSkill,
  getSkillById,
} = require("../controllers/skillController");

const router = express.Router();

router.get("/", getSkills);
router.get("/:id", getSkillById);
router.post("/", createSkill);

module.exports = router;