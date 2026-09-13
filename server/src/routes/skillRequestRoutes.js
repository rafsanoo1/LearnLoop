const express = require("express");

const {
  createSkillRequest,
  getSkillRequests,
  updateSkillRequestStatus,
} = require("../controllers/skillRequestController");


const router = express.Router();


// Student 1 creates request
router.post("/", createSkillRequest);


// Student 2 views requested skills
router.get("/", getSkillRequests);


// Student 2 accepts/rejects request
router.patch("/:id", updateSkillRequestStatus);


module.exports = router;