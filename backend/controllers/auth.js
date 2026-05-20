const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const passport = require("passport");

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const sendOtpEmail = async (user, otp, minutesToExpire) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"School Principal" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in ${minutesToExpire} minutes.`,
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ username, email, password });
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    passport.authenticate("local", { session: false }, async (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Authentication failed" });
      }

      if (!user) {
        return res.status(400).json({ message: info?.message || "Invalid credentials" });
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000;
      user.lastOtpSentAt = new Date();
      await user.save();

      await sendOtpEmail(user, otp, 10);

      return res.status(200).json({
        message: "OTP sent to your email. Enter the code to complete login.",
        step: "OTP_REQUIRED",
      });
    })(req, res, next);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.lastOtpSentAt = null;
    await user.save();

    const payload = {
      id: user._id,
      email: user.email,
      name: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res
      .header("Authorization", `Bearer ${token}`)
      .json({ message: "Login successful", role: user.role, username: user.username });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.lastOtpSentAt && Date.now() - user.lastOtpSentAt.getTime() < 30 * 1000) {
      return res.status(429).json({
        message: "Please wait 30 seconds before requesting another OTP",
      });
    }

    const newOtp = crypto.randomInt(100000, 999999).toString();
    user.otp = newOtp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    user.lastOtpSentAt = new Date();
    await user.save();

    await sendOtpEmail(user, newOtp, 10);

    return res.json({ message: "New OTP sent to your email." });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
