const SkillOffer = require("../models/SkillOffer");

// GET ALL SKILLS
const getSkills = async (req, res) => {
  try {
    const skills = await SkillOffer.find()
      .sort({ createdAt: -1 });

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load skills.",
      error: error.message,
    });
  }
};

// CREATE SKILL
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

// GET SINGLE SKILL
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

// UPDATE SKILL
const updateSkill = async (req, res) => {
  try {
    const updatedSkill = await SkillOffer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSkill) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update skill.",
      error: error.message,
    });
  }
};

// DELETE SKILL
const deleteSkill = async (req, res) => {
  try {
    const deletedSkill = await SkillOffer.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSkill) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    res.status(200).json({
      message: "Skill deleted successfully.",
      skill: deletedSkill,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete skill.",
      error: error.message,
    });
  }
};

module.exports = {
  getSkills,
  createSkill,
  getSkillById,
  updateSkill,
  deleteSkill,
};