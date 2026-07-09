import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import apiLogger from "./middleware/apiLogger.js";
import connectDB from "./config/db.js";
import limiter from "./middleware/rateLimiter.js";
import Routes from "./routes/routes.js";
import "./config/passport.js";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`
});
console.log("Environment:", process.env.NODE_ENV);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = [
  "http://localhost:3000",
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
  credentials:true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
};

const app = express();

connectDB();

app.use(apiLogger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(passport.initialize());

app.use((_, res, next) => {
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});

app.get("/", (_req, res) => {
  return res.json({
    success: 1,
    message: "Yes i am running!",
    response: 200,
    data: {},
  });
});

app.use("/api", Routes);

const UPLOADS_PATH = path.join(__dirname, "uploads");
app.use("/uploads", express.static(UPLOADS_PATH));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
});
