import passport from "passport";
import LocalStrategy from "passport-local";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (_email, _password, done) => {
      done(null, false, { message: "Local authentication is not configured for this backend." });
    },
  ),
);

export default passport;
