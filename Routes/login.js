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

/**
 * @swagger
 * /api/loginApps/Stockout/confirmLogin:
 *   post:
 *     summary: Konfirmasi login untuk aplikasi stockout
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - USERNAME
 *               - PASSWORD
 *             properties:
 *               USERNAME:
 *                 type: string
 *                 description: User ID
 *                 example: "USER001"
 *               PASSWORD:
 *                 type: string
 *                 description: Password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 msg:
 *                   type: string
 *                   description: Pesan sukses
 *       400:
 *         description: Validation error
 *       401:
 *         description: Login gagal
 */
router.post(
  "/Stockout/confirmLogin",
  loginValidation,
  handleValidationErrors,
  confirmLoginStockoutApps
);

/**
 * @swagger
 * /api/loginApps/Stockout/confirmLoginQr:
 *   post:
 *     summary: Konfirmasi login QR untuk aplikasi stockout
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrCode
 *             properties:
 *               qrCode:
 *                 type: string
 *                 description: QR code data
 *                 example: "QR_DATA_HERE"
 *     responses:
 *       200:
 *         description: Login QR berhasil
 *       400:
 *         description: Validation error
 *       401:
 *         description: Login QR gagal
 */
router.post(
  "/Stockout/confirmLoginQr",
  loginValidationQR,
  handleValidationErrors,
  confirmLoginQrStockoutApps
);

/**
 * @swagger
 * /api/loginApps/Stockout/validateToken:
 *   post:
 *     summary: Validasi JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valid
 *       401:
 *         description: Token tidak valid
 */
router.post("/Stockout/validateToken", authenticateToken, validateToken);

/**
 * @swagger
 * /api/loginApps/Stockout/changePassword:
 *   post:
 *     summary: Ubah password user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Password lama
 *               newPassword:
 *                 type: string
 *                 description: Password baru
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/Stockout/changePassword", authenticateToken, changePassword);

/**
 * @swagger
 * /api/loginApps/testRoute:
 *   get:
 *     summary: Test route untuk login
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Test berhasil
 *         content:
 *           text/plain:
 *             example: "PE Development 2024 asep"
 */
router.get("/testRoute", async (req, res) =>
  res.send("PE Development 2024 asep")
);

export default router;
