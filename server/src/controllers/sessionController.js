const SkillSession = require("../models/SkillSession");
const SkillOffer = require("../models/SkillOffer");

const createSession = async (req, res) => {
  try {
    const {
      skillOfferId,
      learnerId,
      scheduledDate,
      scheduledTime,
      duration,
      creditCost,
      objective,
      mode,
    } = req.body;

    const skillOffer = await SkillOffer.findById(skillOfferId);

    if (!skillOffer) {
      return res.status(404).json({
        message: "Skill offer not found.",
      });
    }

    const session = await SkillSession.create({
      skillOfferId,
      mentorId: skillOffer.mentorId,
      learnerId,
      scheduledDate,
      scheduledTime,
      duration,
      creditCost,
      objective,
      mode,
      status: "pending",
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create session request.",
      error: error.message,
    });
  }
};

module.exports = {
  createSession,
};