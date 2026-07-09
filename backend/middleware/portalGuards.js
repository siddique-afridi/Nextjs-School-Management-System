import Teacher from "../models/Teacher.js";
import Student from "../models/Students.js";

/** Teachers may only access their assigned class — prevents viewing other classes */
export const ensureTeacherOwnsClass = async (req, res, next) => {
  if (req.user.role === "Admin") return next();
  if (req.user.role !== "Teacher") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const teacher = await Teacher.findById(req.user.id).select("teachSclass");
  if (!teacher || teacher.teachSclass.toString() !== req.params.id) {
    return res.status(403).json({ message: "You can only access your assigned class" });
  }

  return next();
};

/** Teachers may only mark attendance for students in their class */
export const ensureTeacherOwnsStudent = async (req, res, next) => {
  if (req.user.role === "Admin") return next();
  if (req.user.role !== "Teacher") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const teacher = await Teacher.findById(req.user.id).select("teachSclass");
  const student = await Student.findById(req.params.id).select("sclassName");

  if (!teacher || !student || teacher.teachSclass.toString() !== student.sclassName.toString()) {
    return res.status(403).json({ message: "Student is not in your class" });
  }

  return next();
};

/** Students may only read their own record */
export const ensureOwnStudent = (req, res, next) => {
  if (req.user.role === "Admin") return next();
  if (req.user.role !== "Student" || req.params.id !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

/** Teachers may only view their own profile */
export const ensureOwnTeacher = (req, res, next) => {
  if (req.user.role === "Admin") return next();
  if (req.user.role === "Teacher" && req.params.id === req.user.id) return next();
  return res.status(403).json({ message: "Forbidden" });
};

export const ensureSchoolMember = async (req, res, next) => {
  const schoolId = req.params.id;

  if (req.user.role === "Admin") {
    if (req.user.id === schoolId) return next();
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.user.role === "Teacher") {
    const teacher = await Teacher.findById(req.user.id).select("school");
    if (teacher?.school?.toString() === schoolId) return next();
  }

  if (req.user.role === "Student") {
    const student = await Student.findById(req.user.id).select("school");
    if (student?.school?.toString() === schoolId) return next();
  }

  return res.status(403).json({ message: "Forbidden" });
};
