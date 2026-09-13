const express = require("express");


const {

  getSkills,

  createSkill,

  getSkillById,

  updateSkill,

} = require("../controllers/skillController");



const router = express.Router();




// get all skills
router.get(
  "/",
  getSkills
);



// get single skill
router.get(
  "/:id",
  getSkillById
);



// create skill
router.post(
  "/",
  createSkill
);



// update skill
router.patch(
  "/:id",
  updateSkill
);



module.exports = router;