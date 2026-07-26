import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";

import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Students.js";
import Sclass from "../models/Class.js";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const createCollectionIfNotExists = async (name) => {
  const exists = await mongoose.connection.db
    .listCollections({ name })
    .toArray();

  if (!exists.length) {
    await mongoose.connection.createCollection(name);
    console.log(`✅ Created collection: ${name}`);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("✅ Connected to MongoDB\n");

    await createCollectionIfNotExists("admins");
    await createCollectionIfNotExists("teachers");
    await createCollectionIfNotExists("students");
    await createCollectionIfNotExists("classes");

    // ==========================
    // ADMIN
    // ==========================

    let admin = await Admin.findOne({
      email: "admin@school.com",
    });

    if (!admin) {
      admin = await Admin.create({
        name: "Super Admin",
        email: "admin@school.com",
        password: await bcrypt.hash("Admin@123", 10),
        schoolName: "ABC Public School",
      });

      console.log("✅ Admin created");
    } else {
      console.log("✔ Admin already exists");
    }

    // ==========================
    // CLASS
    // ==========================

    let sclass = await Sclass.findOne({
      sclassName: "Grade 10",
      school: admin._id,
    });

    if (!sclass) {
      sclass = await Sclass.create({
        sclassName: "Grade 10",
        school: admin._id,
      });

      console.log("✅ Class created");
    } else {
      console.log("✔ Class already exists");
    }

    // ==========================
    // TEACHER
    // ==========================

    let teacher = await Teacher.findOne({
      email: "teacher@school.com",
    });

    if (!teacher) {
      teacher = await Teacher.create({
        name: "Demo Teacher",
        email: "teacher@school.com",
        password: await bcrypt.hash("Teacher@123", 10),
        school: admin._id,
        teachSclass: sclass._id,
      });

      console.log("✅ Teacher created");
    } else {
      console.log("✔ Teacher already exists");
    }

    // ==========================
    // STUDENT
    // ==========================

    let student = await Student.findOne({
      rollNum: 1,
      school: admin._id,
    });

    if (!student) {
      student = await Student.create({
        name: "Demo Student",
        rollNum: 1,
        password: await bcrypt.hash("Student@123", 10),
        school: admin._id,
        sclassName: sclass._id,
      });

      console.log("✅ Student created");
    } else {
      console.log("✔ Student already exists");
    }

    console.log("\n🎉 Database seeded successfully.");

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seed failed");
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
