const express = require("express");

const {
  getUserById,
  createUser,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

// GET USER BY ID
router.get("/:id", getUserById);

// CREATE USER
router.post("/", createUser);

// UPDATE USER PROFILE
router.patch("/:id", updateUser);

module.exports = router;