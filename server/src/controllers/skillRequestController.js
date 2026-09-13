const SkillRequest = require("../models/SkillRequest");


// Student 1 creates skill request
const createSkillRequest = async (req, res) => {

  console.log("CREATE REQUEST BODY:", req.body);

  try {

    const {
      requesterId,
      skillName,
      category,
      level,
      mode,
      learningGoal,
    } = req.body;


    const skillRequest = await SkillRequest.create({

      requesterId,
      skillName,
      category,
      level,
      mode,
      learningGoal,
      status: "open",

    });


    res.status(201).json(skillRequest);


  } catch (error) {


    console.log("CREATE REQUEST ERROR:", error.message);


    res.status(400).json({

      message: "Failed to create skill request.",
      error: error.message,

    });


  }

};




// Student 2 views requested skills
const getSkillRequests = async (req, res) => {

  try {


    const requests = await SkillRequest.find()
      .sort({ createdAt: -1 });


    res.status(200).json(requests);


  } catch (error) {


    res.status(500).json({

      message: "Failed to fetch skill requests.",
      error: error.message,

    });


  }

};




// Student 2 accepts or rejects request
const updateSkillRequestStatus = async (req, res) => {

  try {

    const { status } = req.body;


    const updatedRequest = await SkillRequest.findByIdAndUpdate(

      req.params.id,

      {
        status: status,
      },

      {
        new: true,
      }

    );


    if (!updatedRequest) {

      return res.status(404).json({

        message: "Skill request not found",

      });

    }


    res.status(200).json(updatedRequest);


  } catch (error) {


    res.status(500).json({

      message: "Failed to update skill request status.",
      error: error.message,

    });


  }

};




module.exports = {

  createSkillRequest,
  getSkillRequests,
  updateSkillRequestStatus,

};