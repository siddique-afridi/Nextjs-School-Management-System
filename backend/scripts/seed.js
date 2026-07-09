import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";

import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Students.js";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`
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

    // Create collections (optional)
    await createCollectionIfNotExists("admins");
    await createCollectionIfNotExists("teachers");
    await createCollectionIfNotExists("students");
    await createCollectionIfNotExists("classes");
    await createCollectionIfNotExists("subjects");
    await createCollectionIfNotExists("notices");
    await createCollectionIfNotExists("complains");

    // ---------- ADMIN ----------
    const adminExists = await Admin.findOne({
      email: "admin@school.com",
    });

    if (!adminExists) {
      await Admin.create({
        name: "Super Admin",
        email: "admin@school.com",
        password: await bcrypt.hash("Admin@123", 10),
        role: "admin",
      });

      console.log("✅ Admin created");
    } else {
      console.log("✔ Admin already exists");
    }

    // ---------- TEACHER ----------
    const teacherExists = await Teacher.findOne({
      email: "teacher@school.com",
    });

    if (!teacherExists) {
      await Teacher.create({
        name: "Demo Teacher",
        email: "teacher@school.com",
        password: await bcrypt.hash("Teacher@123", 10),
        role: "teacher",
      });

      console.log("✅ Teacher created");
    } else {
      console.log("✔ Teacher already exists");
    }

    // ---------- STUDENT ----------
    const studentExists = await Student.findOne({
      email: "student@school.com",
    });

    if (!studentExists) {
      await Student.create({
        name: "Demo Student",
        email: "student@school.com",
        password: await bcrypt.hash("Student@123", 10),
        role: "student",
      });

      console.log("✅ Student created");
    } else {
      console.log("✔ Student already exists");
    }

    console.log("\n Database seeded successfully🤲");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed");
    console.error(err);

    process.exit(1);
  }
};

seedDatabase();