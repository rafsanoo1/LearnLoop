const mongoose = require("mongoose");

const skillRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: String,
      required: true,
    },

    skillName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    mode: {
      type: String,
      enum: ["Online", "In Person", "Either"],
      required: true,
    },

    learningGoal: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 300,
    },

    status: {
      type: String,
      enum: ["open", "matched", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SkillRequest",
  skillRequestSchema
);
