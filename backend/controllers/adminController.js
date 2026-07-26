import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { generateToken } from "../utils/generateToken.js";
import { setAuthCookie } from "../utils/authCookie.js";

const adminRegister = async (req, res) => {
  try {
    const { name, email, password, schoolName } = req.body;

    if (!name || !email || !password || !schoolName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdminByEmail = await Admin.findOne({ email });
    if (existingAdminByEmail) {
      return res.status(409).json({ field: "email", message: "Email already exists" });
    }

    const existingSchool = await Admin.findOne({ schoolName });
    if (existingSchool) {
      return res.status(409).json({ field: "schoolName", message: "School name already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      schoolName,
    });

    const result = await admin.save();
    result.password = undefined;

    return res.status(201).json({ result, message: "Registered Successfully" });
  } catch (_err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or Password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(admin._id, "Admin");
    const adminData = admin.toObject();
    delete adminData.password;

    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: adminData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAdminDetail = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
      admin.password = undefined;
      res.send(admin);
    } else {
      res.send({ message: "No admin found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export { adminRegister, adminLogIn, getAdminDetail };
