import Admin from "../models/Admin.js";


const me = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default me;