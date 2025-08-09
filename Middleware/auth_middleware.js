import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access token required",
        msg: "Token akses diperlukan",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid token format",
        msg: "Format token tidak valid",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        msg: "Token sudah kadaluarsa",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        msg: "Token tidak valid",
      });
    }

    res.status(401).json({
      error: "Unauthorized",
      msg: "Tidak memiliki akses",
    });
  }
};

// Optional: Role-based middleware
export const requireStockoutRole = async (req, res, next) => {
  try {
    const { username } = req.user;

    // Check if user has stockout role
    const userData = await AuthService.validateUserCredentials(username, null);

    if (!userData) {
      return res.status(403).json({
        error: "Insufficient permissions",
        msg: "Tidak memiliki izin untuk akses stockout",
      });
    }

    next();
  } catch (error) {
    console.error("Role check failed:", error);
    res.status(500).json({
      error: "Internal server error",
      msg: "Gagal memeriksa izin akses",
    });
  }
};
