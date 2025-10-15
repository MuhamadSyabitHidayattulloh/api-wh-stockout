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
  body("email")
    .optional({ nullable: true })
    .isEmail()
    .withMessage("Invalid email format"),
  body("company").notEmpty().withMessage("Company is required"),
  body("plant").notEmpty().withMessage("Plant is required"),
  body("buCode").optional().isString().withMessage("BU code must be a string"),
];

// User check validation
const userCheckValidation = [
  body("userID")
    .notEmpty()
    .withMessage("User ID is required")
    .isLength({ min: 3 })
    .withMessage("User ID must be at least 3 characters"),
];

/**
 * @swagger
 * /api/registration/checkNpk:
 *   post:
 *     summary: Cek NPK user
 *     tags: [Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID yang akan dicek
 *                 example: "USER001"
 *     responses:
 *       200:
 *         description: NPK berhasil dicek
 *       400:
 *         description: Validation error
 */
router.post(
  "/checkNpk",
  userCheckValidation,
  handleValidationErrors,
  registrationController.checkNpk
);

/**
 * @swagger
 * /api/registration/updateRole:
 *   post:
 *     summary: Update role user
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - newRole
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID
 *               newRole:
 *                 type: string
 *                 description: Role baru
 *     responses:
 *       200:
 *         description: Role berhasil diupdate
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/updateRole",
  authenticateToken,
  registrationController.updateRole
);

/**
 * @swagger
 * /api/registration/showCompany:
 *   get:
 *     summary: Tampilkan daftar company
 *     tags: [Registration]
 *     responses:
 *       200:
 *         description: Daftar company berhasil diambil
 */
router.get("/showCompany", registrationController.showCompany);

/**
 * @swagger
 * /api/registration/showPlant:
 *   get:
 *     summary: Tampilkan daftar plant berdasarkan company
 *     tags: [Registration]
 *     parameters:
 *       - in: query
 *         name: companyCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Company code
 *     responses:
 *       200:
 *         description: Daftar plant berhasil diambil
 */
router.get("/showPlant", registrationController.showPlant);

/**
 * @swagger
 * /api/registration/showBU:
 *   get:
 *     summary: Tampilkan daftar BU berdasarkan company dan plant
 *     tags: [Registration]
 *     parameters:
 *       - in: query
 *         name: companyCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Company code
 *       - in: query
 *         name: plantCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Plant code
 *     responses:
 *       200:
 *         description: Daftar BU berhasil diambil
 */
router.get("/showBU", registrationController.showBU);

/**
 * @swagger
 * /api/registration/registerNew:
 *   post:
 *     summary: Registrasi user baru
 *     tags: [Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - password
 *               - name
 *               - company
 *               - plant
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID
 *                 example: "USER001"
 *               password:
 *                 type: string
 *                 description: Password
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 description: Nama lengkap
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email (opsional)
 *                 example: "john@example.com"
 *               company:
 *                 type: string
 *                 description: Company
 *                 example: "Company A"
 *               plant:
 *                 type: string
 *                 description: Plant
 *                 example: "Plant 1"
 *               buCode:
 *                 type: string
 *                 description: BU Code (optional)
 *                 example: "BU001"
 *     responses:
 *       200:
 *         description: Registrasi berhasil
 *       400:
 *         description: Validation error
 */
router.post(
  "/registerNew",
  registrationValidation,
  handleValidationErrors,
  registrationController.registerNew
);

/**
 * @swagger
 * /api/registration/user/{username}:
 *   get:
 *     summary: Dapatkan informasi user
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username user
 *     responses:
 *       200:
 *         description: Informasi user berhasil diambil
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User tidak ditemukan
 */
router.get(
  "/user/:username",
  authenticateToken,
  registrationController.getUserInfo
);

/**
 * @swagger
 * /api/registration/updateStockoutRole:
 *   post:
 *     summary: Update role stockout user
 *     tags: [Registration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *               - stockoutRole
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID
 *               stockoutRole:
 *                 type: string
 *                 description: Role stockout baru
 *     responses:
 *       200:
 *         description: Role stockout berhasil diupdate
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/updateStockoutRole",
  authenticateToken,
  registrationController.updateStockoutRole
);

/**
 * @swagger
 * /api/registration/validateRegistration:
 *   post:
 *     summary: Validasi data registrasi
 *     tags: [Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: User ID yang akan divalidasi
 *     responses:
 *       200:
 *         description: Validasi berhasil
 */
router.post(
  "/validateRegistration",
  registrationController.validateRegistration
);

/**
 * @swagger
 * /api/registration/testRoute:
 *   get:
 *     summary: Test route untuk registration
 *     tags: [Registration]
 *     responses:
 *       200:
 *         description: Test berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/testRoute", (req, res) =>
  res.json({
    msg: "Registration service test route",
    status: "success",
    timestamp: new Date().toISOString(),
  })
);

export default router;
