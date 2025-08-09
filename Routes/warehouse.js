import express from "express";
import {
  getPartCategoryShopping,
  stoctkoutAndroidWHSystem,
} from "../Controller/warehouse.js";

const router = express.Router();
router.get("/testRoute", (req, res) => {
  res.send("PE DEVELOPMENT 2024");
});
router.post("/getCategoryPart", getPartCategoryShopping);
router.post("/stockoutAndroid", stoctkoutAndroidWHSystem);
export default router;
