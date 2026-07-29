import Conversation from "../models/Conversation.js";
import Student from "../models/Students.js";
import Teacher from "../models/Teacher.js";
import Sclass from "../models/Class.js";


export const createClassConversation = async (req, res) => {
  try {
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({
        message: "classId is required",
      });
    }

    const classDoc = await Sclass.findById(classId);

    if (!classDoc) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    const existingConversation =
      await Conversation.findOne({
        type: "CLASS",
        classId,
      });

    if (existingConversation) {
      return res.status(200).json({
        message: "Class conversation already exists",
        conversation: existingConversation,
      });
    }

    const conversation = await Conversation.create({
      type: "CLASS",
      classId: classDoc._id,
      schoolId: classDoc.school,
    });

    return res.status(201).json({
      message: "Class conversation created",
      conversation,
    });
  } catch (error) {
    console.error(
      "Create class conversation error:",
      error,
    );

    return res.status(500).json({
      message: "Failed to create class conversation",
      error: error.message,
    });
  }
};

export const getMyClassConversation = async (req, res) => {
  try {
    const userId = req.user.id;

    // Search both collections in parallel
    const [student, teacher] = await Promise.all([
      Student.findById(userId).select("sclassName"),
      Teacher.findById(userId).select("teachSclass"),
    ]);

    // Extract sclassName from whichever record exists
    const classId = student?.sclassName || teacher?.teachSclass;


    if (!classId) {
      return res.status(404).json({
        message: "User or class assignment not found",
      });
    }

    const conversation = await Conversation.findOne({
      type: "CLASS",
      classId: classId,
    }).populate("classId");

    if (!conversation) {
      return res.status(404).json({
        message: "Class conversation has not been created yet",
      });
    }

    return res.status(200).json({
      conversation,
    });
  } catch (error) {
    console.error("Get class conversation error:", error);

    return res.status(500).json({
      message: "Failed to get class conversation",
      error: error.message,
    });
  }
};
