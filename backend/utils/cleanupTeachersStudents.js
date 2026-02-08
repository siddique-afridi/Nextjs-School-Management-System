const mongoose = require("mongoose");
const User = require("../models/User");     // adjust path if needed
// const Teacher = require("../models/teacherModel/teachers"); // adjust path if needed
const Student = require('../models/Students')

// connect to your database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB error", err));

async function cleanOrphanedTeacherUsers() {
  try {
    // find all users who are teachers
    // const teacherUsers = await User.find({ role: "teacher" });

    // for (const user of teacherUsers) {
    //   // check if this teacher exists in Teacher collection
    //   const teacher = await Teacher.findOne({ email: user.email });

    //   // if no teacher found, delete that user
    //   if (!teacher) {
    //     console.log(`Deleting user: ${user.email}`);
    //     await User.findByIdAndDelete(user._id);
    //   }
    // }
    const studentUsers = await User.find({ role: "student" });

    for (const user of studentUsers) {
      const student = await Student.findOne({ email: user.email });
      if (!student) {
        console.log(`🗑️ Deleting student user: ${user.email}`);
        await User.findByIdAndDelete(user._id);
      }
    }

    console.log("✅ Cleanup complete!");
  } catch (error) {
    console.log("Error cleaning users:", error);
  } finally {
    mongoose.connection.close();
  }
}

cleanOrphanedTeacherUsers();
