import { rateLimit } from "express-rate-limit";

const isDevelopment = process.env.NODE_ENV !== "production";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: isDevelopment ? 200 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: "Too many requests. Try again after a few minutes.",
    });
  },
});

export default limiter;
