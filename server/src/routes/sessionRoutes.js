const express = require("express");

const {
  getSessions,
  createSession,
  getSessionById,
  updateSession,
} = require("../controllers/sessionController");

const router = express.Router();

// GET all sessions
router.get(
  "/",
  getSessions
);

// GET single session
router.get(
  "/:id",
  getSessionById
);

// CREATE session
router.post(
  "/",
  createSession
);

// UPDATE session
router.patch(
  "/:id",
  updateSession
);

module.exports = router;