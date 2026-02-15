const express = require ('express');
const passport = require("passport");
const jwt = require('jsonwebtoken')
const router = express.Router();
const  auth = require ('../middleware/auth');
const {login, register, verifyOtp, resendOtp} = require ('../controllers/auth');
const {getMe} = require ('../controllers/userController');
const limiter = require('../middleware/rateLimiter');
const { body, validationResult } = require('express-validator');



router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
],
  register);
// router.post('/login', login);

router.post(
    "/login",login
  );

  // Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    console.log("✅ Google callback reached. User:", user);


    const payload = {id:user._id, email:user.email, name: user.username, role: user.role};

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'1h'}); 

    const frontendURL =
      process.env.NODE_ENV === "production"
        ? "https://lixschool.vercel.app" //deployed frontend
        : "http://localhost:5173"; // local development  

     // Redirect with JWT to frontend
     res.redirect(`${frontendURL}/login-success?token=${token}`);
    //  res.redirect(`http://localhost:5173/login-success?token=${token}`);
     console.log("✅ Google callback reached. User: after", user);
  });


router.post("/verify-otp", verifyOtp);
router.post("/resend-otp",
  limiter,
  resendOtp);

router.get('/me',auth, getMe);

module.exports = router ;