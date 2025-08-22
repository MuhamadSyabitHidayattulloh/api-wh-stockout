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
 *               partNo:
 *                 type: string
 *                 description: Nomor part
 *                 example: "PART001"
 *               quantity:
 *                 type: number
 *                 description: Jumlah yang di-stockout
 *                 example: 10
 *               location:
 *                 type: string
 *                 description: Lokasi warehouse
 *                 example: "LOC001"
 *     responses:
 *       200:
 *         description: Stockout berhasil diproses
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/stockoutAndroid", stoctkoutAndroidWHSystem);

export default router;
