import jwt from "jsonwebtoken";

export const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: "Admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};
