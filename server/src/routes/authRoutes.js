const express = require("express");

const {
  register,
  login,
  forgotPassword,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// FORGOT PASSWORD
router.post(
  "/forgot-password",
  forgotPassword
);

// LOGOUT
router.post("/logout", logout);

module.exports = router;