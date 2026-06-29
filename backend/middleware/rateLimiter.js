import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 2,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: "Try again after 5 minutes.",
    });
  },
});

export default limiter;