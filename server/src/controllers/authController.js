const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");

// REGISTER
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      department,
      semester,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !studentId ||
      !department ||
      !semester
    ) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const existingStudent = await User.findOne({
      studentId: studentId.trim(),
    });

    if (existingStudent) {
      return res.status(409).json({
        message:
          "An account with this student ID already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const userId = `u${crypto
      .randomBytes(8)
      .toString("hex")}`;

    const user = await User.create({
      _id: userId,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      studentId: studentId.trim(),
      department: department.trim(),
      semester: semester.trim(),
    });

    res.status(201).json({
      message: "Registration successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        semester: user.semester,
      },
    });
  } catch (error) {
    console.error(
      "Registration failed:",
      error
    );

    res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
};


// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        semester: user.semester,
      },
    });
  } catch (error) {
    console.error(
      "Login failed:",
      error
    );

    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
};


// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Do not reveal whether an email exists.
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, password reset instructions will be provided.",
      });
    }

    res.status(200).json({
      message:
        "Password reset request received.",
      resetAvailable: true,
    });
  } catch (error) {
    console.error(
      "Forgot password failed:",
      error
    );

    res.status(500).json({
      message:
        "Unable to process password reset request.",
    });
  }
};


// LOGOUT
const logout = async (req, res) => {
  res.status(200).json({
    message: "Logout successful.",
  });
};


module.exports = {
  register,
  login,
  forgotPassword,
  logout,
};