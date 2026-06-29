import mongoose from "mongoose";
import Student from "../models/Students.js";

const cleanupTeachersStudents = async () => {
  try {
    const studentUsers = await Student.find({});
    return studentUsers;
  } catch (error) {
    console.log("Error cleaning users:", error);
    return [];
  }
};

export default cleanupTeachersStudents;

if (process.argv[1] && process.argv[1].endsWith("cleanupTeachersStudents.js")) {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      await cleanupTeachersStudents();
      await mongoose.connection.close();
    })
    .catch((err) => console.log("DB error", err));
}
