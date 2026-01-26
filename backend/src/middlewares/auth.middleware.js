const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Full user object

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
