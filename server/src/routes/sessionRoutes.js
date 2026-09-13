const express = require("express");

const {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
} = require("../controllers/sessionController");

const router = express.Router();


// GET ALL SESSIONS
router.get(
  "/",
  getSessions
);


// GET SINGLE SESSION
router.get(
  "/:id",
  getSessionById
);


// CREATE SESSION
router.post(
  "/",
  createSession
);


// UPDATE SESSION
router.patch(
  "/:id",
  updateSession
);


module.exports = router;