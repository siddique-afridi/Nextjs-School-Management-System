const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

//   LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // use 'email' instead of default 'username'
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }); // find user by email
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
          return done(null, false, { message: "Invalid credentials" });

        return done(null, user); // success
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// GOOGLE STRATEGY
const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientID && googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? "https://schoolserver.up.railway.app/api/auth/google/callback"
            : "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email });

            if (user) {
              user.googleId = profile.id;
              await user.save();
            } else {
              user = await User.create({
                username: profile.displayName,
                email,
                googleId: profile.id,
              });
            }
          }

          return done(null, user);
        } catch (err) {
          console.error("Google auth error:", err);
          return done(err, false);
        }
      },
    ),
  );
} else {
  console.warn("Google OAuth is disabled because GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set.");
}

// serialize + deserialize (optional if using sessions)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id).then((u) => done(null, u)),
);

// FACEBOOK STRATEGY
//   passport.use(
//     new FacebookStrategy(
//       {
//         clientID: process.env.FACEBOOK_CLIENT_ID,
//         clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//         callbackURL: "/api/auth/facebook/callback",
//         profileFields: ["id", "displayName", "emails"], // request email and name
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           let user = await User.findOne({ facebookId: profile.id });
//           if (!user) {
//             user = await User.create({
//               name: profile.displayName,
//               email: profile.emails?.[0]?.value || "",
//               facebookId: profile.id,
//             });
//           }
//           done(null, user);
//         } catch (err) {
//           done(err, false);
//         }
//       }
//     )
//   );
