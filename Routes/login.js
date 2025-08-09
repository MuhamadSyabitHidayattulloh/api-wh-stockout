// Routes/login.js - Enhanced
import express from "express";
import {
  confirmLoginQrStockoutApps,
  confirmLoginStockoutApps,
  validateToken,
  changePassword,
} from "../Controller/login.js";
import { loginValidation } from "../Validation/loginValidation.js";
import { loginValidationQR } from "../Validation/loginValidationQr.js";
import { authenticateToken } from "../Middleware/auth_middleware.js";
import { validationResult } from "express-validator";

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
      msg: "Validation failed",
    });
  }
  next();
};

// Existing routes
router.post(
  "/Stockout/confirmLogin",
  loginValidation,
  handleValidationErrors,
  confirmLoginStockoutApps
);

router.post(
  "/Stockout/confirmLoginQr",
  loginValidationQR,
  handleValidationErrors,
  confirmLoginQrStockoutApps
);

// New routes
router.post("/Stockout/validateToken", authenticateToken, validateToken);

router.post(
  "/Stockout/changePassword",
  authenticateToken,
  // Add password validation here if needed
  changePassword
);

router.get("/testRoute", async (req, res) =>
  res.send("PE Development 2024 asep")
);

export default router;
