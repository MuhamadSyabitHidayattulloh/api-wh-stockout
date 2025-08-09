import express from "express";
import * as registrationController from "../Controller/regis.js";
import { authenticateToken } from "../Middleware/auth_middleware.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Validation failed",
      status: "validationError",
      errors: errors.array(),
    });
  }
  next();
};

// Registration validation rules
const registrationValidation = [
  body("userID")
    .isLength({ min: 3 })
    .withMessage("User ID must be at least 3 characters")
    .matches(/^\w+$/)
    .withMessage("User ID can only contain letters, numbers, and underscores"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("name")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("company").notEmpty().withMessage("Company is required"),
  body("plant").notEmpty().withMessage("Plant is required"),
];

// User check validation
const userCheckValidation = [
  body("userID")
    .notEmpty()
    .withMessage("User ID is required")
    .isLength({ min: 3 })
    .withMessage("User ID must be at least 3 characters"),
];

// Existing routes
router.post(
  "/checkNpk",
  userCheckValidation,
  handleValidationErrors,
  registrationController.checkNpk
);

router.post(
  "/updateRole",
  authenticateToken, // Require authentication
  registrationController.updateRole
);

router.get("/showCompany", registrationController.showCompany);

router.get("/showPlant", registrationController.showPlant);

router.post(
  "/registerNew",
  registrationValidation,
  handleValidationErrors,
  registrationController.registerNew
);

// New enhanced routes
router.get(
  "/user/:username",
  authenticateToken,
  registrationController.getUserInfo
);

router.post(
  "/updateStockoutRole",
  authenticateToken,
  registrationController.updateStockoutRole
);

router.post(
  "/validateRegistration",
  registrationController.validateRegistration
);

router.get("/testRoute", (req, res) =>
  res.json({
    msg: "Registration service test route",
    status: "success",
    timestamp: new Date().toISOString(),
  })
);

export default router;
