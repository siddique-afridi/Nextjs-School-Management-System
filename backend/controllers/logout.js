import { clearAuthCookie } from "../utils/authCookie.js";

const logout = (_req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out successfully" });
};

export default logout;
