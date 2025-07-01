// middleware/admin.js (backend)
module.exports = function (req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
  } catch (error) {
    console.error("Error in admin middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
