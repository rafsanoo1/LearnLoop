
const SkillSession = require("../models/SkillSession");
const SkillOffer = require("../models/SkillOffer");

// GET ALL SESSIONS
const getSessions = async (req, res) => {
  try {
    const sessions = await SkillSession.find()
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load sessions.",
      error: error.message,
    });
  }
};

// CREATE SESSION
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

// GET SINGLE SESSION
const getSessionById = async (req, res) => {
  try {
    const session = await SkillSession.findById(
      req.params.id
    );

    if (!session) {
      return res.status(404).json({
        message: "Session not found.",
      });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(400).json({
      message: "Failed to load session.",
      error: error.message,
    });
  }
};

// UPDATE SESSION
const updateSession = async (req, res) => {
  try {
    const updatedSession =
      await SkillSession.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedSession) {
      return res.status(404).json({
        message: "Session not found.",
      });
    }

    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update session.",
      error: error.message,
    });
  }
};

module.exports = {
  getSessions,
  createSession,
  getSessionById,
  updateSession,
};