import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Students.js";

const me = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role === "Admin") {
      const admin = await Admin.findById(id).select("-password");
      if (!admin) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(admin);
    }

    if (role === "Teacher") {
      const teacher = await Teacher.findById(id)
        .select("-password")
        .populate("teachSubject", "subName sessions")
        .populate("school", "schoolName")
        .populate("teachSclass", "sclassName");
      if (!teacher) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(teacher);
    }

    if (role === "Student") {
      const student = await Student.findById(id)
        .select("-password")
        .populate("school", "schoolName")
        .populate("sclassName", "sclassName")
        .populate("examResult.subName", "subName sessions")
        .populate("attendance.subName", "subName sessions");
      if (!student) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(student);
    }

    return res.status(403).json({ message: "Invalid role" });
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default me;
