const mongoose = require("mongoose");

const skillOfferSchema = new mongoose.Schema(
  {
    mentorId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    mode: {
      type: String,
      enum: ["Online", "In Person", "Both"],
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    availableDays: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SkillOffer",
  skillOfferSchema
);