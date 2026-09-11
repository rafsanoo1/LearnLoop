const SkillRequest = require("../models/SkillRequest");

const createSkillRequest = async (req, res) => {
  try {
    const {
      requesterId,
      skillName,
      category,
      level,
      mode,
      learningGoal,
    } = req.body;

    const skillRequest = await SkillRequest.create({
      requesterId,
      skillName,
      category,
      level,
      mode,
      learningGoal,
      status: "open",
    });

    res.status(201).json(skillRequest);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create skill request.",
      error: error.message,
    });
  }
};

module.exports = {
  createSkillRequest,
};