import Complain from "../models/Complains.js";
import Student from "../models/Students.js";

const complainCreate = async (req, res) => {
  try {
    const payload = { ...req.body };

    // Students can only file complaints for themselves — prevents spoofing
    if (req.user?.role === "Student") {
      const student = await Student.findById(req.user.id).select("school");
      if (!student) return res.status(404).json({ message: "Student not found" });
      payload.user = req.user.id;
      payload.school = student.school;
      payload.date = new Date();
    }

    const complain = new Complain(payload);
    const result = await complain.save();
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create complaint" });
  }
};

const complainList = async (req, res) => {
  try {
    const complains = await Complain.find({ school: req.params.id }).populate("user", "name");
    if (complains.length > 0) {
      return res.send(complains);
    }
    return res.send({ message: "No complains found" });
  } catch {
    return res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

const myComplaints = async (req, res) => {
  try {
    const complains = await Complain.find({ user: req.user.id }).sort({ date: -1 });
    return res.send(complains);
  } catch {
    return res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

export { complainCreate, complainList, myComplaints };
