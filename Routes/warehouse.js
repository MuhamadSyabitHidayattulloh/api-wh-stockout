import express from "express";
import {
  getDataSeparationByOneWayKanban,
  getDataStoragingByOneWayKanban,
  getDetailShoppingList,
  getPartCategoryShopping,
  getTotalDataSeparation,
  getTotalDataStoraging,
  stockoutInstructionController,
  stockoutWithoutInstructionController,
  stoctkoutAndroidWHSystem,
} from "../Controller/warehouse.js";

const router = express.Router();
router.get("/testRoute", (req, res) => {
  res.send("PE DEVELOPMENT 2024");
});

router.get(
  "/getDataStoragingByOneWayKanban/:id",
  getDataStoragingByOneWayKanban
);
router.get(
  "/getDataSeparationByOneWayKanban/:id",
  getDataSeparationByOneWayKanban
);

router.post("/getDataStoraging", getTotalDataStoraging);
router.post("/getDataSeparation", getTotalDataSeparation);

/* 
##############################################################################
NOTE : Menggunakan metode yang lama (Cpool) 
AUTHOR : BRAV
##############################################################################
*/
router.post(
  "/stockOutWithoutInstruction",
  stockoutWithoutInstructionController
);

router.post("/getCategoryPart", getPartCategoryShopping);
router.post("/getDetailShoppingList", getDetailShoppingList);
router.post("/stockOutWithInstruction", stockoutInstructionController);
router.post("/stockoutAndroid", stoctkoutAndroidWHSystem);
export default router;
