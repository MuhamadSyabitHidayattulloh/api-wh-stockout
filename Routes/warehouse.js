import express from "express";
import {
  getPartCategoryShopping,
  stoctkoutAndroidWHSystem,
} from "../Controller/warehouse.js";

const router = express.Router();

/**
 * @swagger
 * /api/warehouse/testRoute:
 *   get:
 *     summary: Test route untuk warehouse
 *     tags: [Warehouse]
 *     responses:
 *       200:
 *         description: Test berhasil
 *         content:
 *           text/plain:
 *             example: "PE DEVELOPMENT 2024"
 */
router.get("/testRoute", (req, res) => {
  res.send("PE DEVELOPMENT 2024");
});

/**
 * @swagger
 * /api/warehouse/getCategoryPart:
 *   post:
 *     summary: Mendapatkan kategori part untuk shopping
 *     tags: [Warehouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plant:
 *                 type: string
 *                 description: Plant ID
 *                 example: "PLANT001"
 *     responses:
 *       200:
 *         description: Kategori part berhasil diambil
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/getCategoryPart", getPartCategoryShopping);

/**
 * @swagger
 * /api/warehouse/stockoutAndroid:
 *   post:
 *     summary: Proses stockout untuk sistem Android
 *     tags: [Warehouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 description: Array data stockout
 *                 items:
 *                   type: object
 *                   properties:
 *                     imgData:
 *                       type: string
 *                       description: QR code data
 *                     timeScan:
 *                       type: string
 *                       description: Waktu scan
 *                     NPK:
 *                       type: string
 *                       description: Nomor Pegawai
 *                     processId:
 *                       type: string
 *                       description: Process ID
 *               slip:
 *                 type: string
 *                 description: Nomor slip
 *                 example: "F1234567890"
 *               deviceId:
 *                 type: string
 *                 description: Device ID untuk tracking
 *                 example: "device-uuid-12345"
 *     responses:
 *       200:
 *         description: Stockout berhasil diproses
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/stockoutAndroidRunning", stoctkoutAndroidWHSystem);

export default router;
