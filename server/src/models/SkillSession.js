const mongoose = require("mongoose");

const skillSessionSchema = new mongoose.Schema(
  {
    skillOfferId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillOffer",
      required: true,
    },

    mentorId: {
      type: String,
      required: true,
    },

    learnerId: {
      type: String,
      required: true,
    },

    scheduledDate: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledTime: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    creditCost: {
      type: Number,
      required: true,
    },

    objective: {
      type: String,
      required: true,
      trim: true,
    },

    mode: {
      type: String,
      enum: ["Online", "In Person"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SkillSession",
  skillSessionSchema
);