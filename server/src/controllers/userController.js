const User = require("../models/User");

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: "Failed to load user.",
      error: error.message,
    });
  }
};


// CREATE USER
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create user.",
      error: error.message,
    });
  }
};


// UPDATE USER PROFILE
const updateUser = async (req, res) => {
  try {
    const {
      name,
      department,
      semester,
      bio,
      teachSkills,
      learnSkills,
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (department !== undefined) {
      updateData.department = department;
    }

    if (semester !== undefined) {
      updateData.semester = semester;
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    if (teachSkills !== undefined) {
      updateData.teachSkills = teachSkills;
    }

    if (learnSkills !== undefined) {
      updateData.learnSkills = learnSkills;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update user profile.",
      error: error.message,
    });
  }
};


module.exports = {
  getUserById,
  createUser,
  updateUser,
};