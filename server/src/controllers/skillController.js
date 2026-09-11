const SkillOffer = require("../models/SkillOffer");

const getSkills = async (req, res) => {
  try {
    const skills = await SkillOffer.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load skills.",
      error: error.message,
    });
  }
};

const createSkill = async (req, res) => {
  try {
    const skill = await SkillOffer.create(req.body);

    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create skill.",
      error: error.message,
    });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await SkillOffer.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    res.status(200).json(skill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to load skill.",
      error: error.message,
    });
  }
};

module.exports = {
  getSkills,
  createSkill,
  getSkillById,
};