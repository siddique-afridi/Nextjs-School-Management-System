const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const apiLogger = require("./middleware/apiLogger");
const connectDB = require("./config/db");
const limiter = require("./middleware/rateLimiter");
const Routes = require("./routes/routes")

require("./config/passport");

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = [
  "http://localhost:5173",
  "https://lixschool.vercel.app",
  "https://www.lixschool.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || !isProduction) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
};

const app = express();

connectDB();

app.use(apiLogger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use((_, res, next) => {
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});

app.get("/", (req, res, next) => {
  return res.json({
    success: 1,
    message: "Yes i am running!",
    response: 200,
    data: {},
  });
})

app.use('/api', Routes)

const UPLOADS_PATH = path.join(__dirname, "uploads");
app.use("/uploads", express.static(UPLOADS_PATH));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
});
