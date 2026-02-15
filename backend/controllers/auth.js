// const express = require ('express');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const passport = require("passport")

// Register API

exports.register = async (req, res) => {
  try {
    // got details from body
    const { username, email, password } = req.body;
    // check existing credentials in User model
    const exist = await User.findOne({ email });

    if (exist)
      return res.status(400).json({ message: "Email already registered" });

    // Always hash password before saving
    // already done in User model

    // now we save user by creating instance of User model
    const user = new User({ username, email, password });
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: "Server error", error: err.message });
  }
};

// Login API

exports.login = async (req, res, next) => {
  try {
    //  commented, as checking credentials are handled by passportjs in config folder

    // const {email, password} = req.body;

    // if(!email || !password) return res.status(400).json({message:"Email and Password required"})

    //     const user = await User.findOne({email});
    //     if(!user) return res.status(400).json({error:"Invalid credentials"})

    // const isMatch = await user.comparePassword(password);
    // if(!isMatch) return res.status(400).json({error:"Invalid Credentials"})

    //   console.log('user', user)

    passport.authenticate("local",{ session: false },async (err, user, info) => {

        if (err) {
          // Server error during authentication
          return res.status(500).json({ error: "Server error" });
        }

        if (!user) {
          // User not found or invalid credentials
          // 'info.message' comes from LocalStrategy's done(null, false, { message: "..." })
          return res
            .status(400)
            .json({ error: info?.message || "Invalid credentials" });
        }

        // const user = req.user;

        // 1  generate   OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 1000; // indicates 10s expiry time
        await user.save();

        console.log("Saved user with OTP:", user);

        const all = await User.find();
        console.log("All users in DB right now:", all.length);

        // 2 setup nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // 3  now send otp through email
        await transporter.sendMail({
          from: `"School Principal" ${process.env.EMAIL_USER}`,
          to: user.email,
          subject: "Your OTP Code",
          text: `Your OTP code is ${otp}. It will expire in 10 seconds.`,
        });

        res.json({
          message: "OTP sent to email. Please verify.",
          step: "OTP_REQUIRED",
        });
      },
    )(req, res, next);    // invoke Passport with current request
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

// RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (
      user.lastOtpSentAt &&
      Date.now() - user.lastOtpSentAt.getTime() < 30 * 1000
    ) {
      return res.status(429).json({
        message: "Please wait 30 seconds before requesting another OTP",
      });
    }

    // Generate new OTP
    const newOtp = crypto.randomInt(100000, 999999).toString();
    user.otp = newOtp;
    user.otpExpiry = Date.now() + 60 * 1000; // 60s
    user.lastOtpSentAt = new Date();
    await user.save();

    console.log("Saved user with new OTP:", user);

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send new OTP
    await transporter.sendMail({
      from: `"School Principal" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your new OTP Code",
      text: `Your new OTP code is ${newOtp}. It will expire in 60 seconds.`,
    });

    res.json({ message: "New OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

//  VERIFY OTP

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // create jwt
    const payload = {
      id: user._id,
      email: user.email,
      name: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //  here we emit event to all connected clients
    // Emit event to all connected clients
    // const io = req.app.get("io");
    // io.emit("userLoggedIn", {
    //   message: `User ${user.username} has logged in`,
    //   user: user,
    // });

    return res.header("Authorization", `Bearer ${token}`).json({
      message: "Login successful",
      // token,
      role: user.role, // send role
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
