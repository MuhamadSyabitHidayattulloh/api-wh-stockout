import moment from "moment";
import { OneWayKanbanProcessed } from "../functions/OneWayKanbanProcessed.js";
import STOCKOUT_T_TRANSACTION from "../Models/STOCKOUT_T_TRANSACTION.js";
import stockoutQueue from "../queues/stockoutProcessor.js";
import { WarehouseService } from "../services/WarehouseService.js";

export const getPartCategoryShopping = async (req, res) => {
  try {
    const data = req.body.partNumberAssy;
    const result = await WarehouseService.getCategoryPart(data);

    res.status(200).json({
      msg: "Get data success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Get data failed",
      errMsg: error,
    });
  }
};

export const getShoppingListController = async (req, res) => {
  try {
    const partno = req.body.partNumberAssy;
    const shoppingList = await WarehouseService.getShoppingList(partno);
    const modelAndProduct =
      await WarehouseService.getModelAndProductShoppingList(partno);

    res.status(200).json({
      msg: "Get shopping list success",
      shoppingList: shoppingList,
      model: modelAndProduct.model,
      product: modelAndProduct.product,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Get shopping list failed",
      errMsg: error,
    });
  }
};

export const stoctkoutAndroidWHSystem = async (req, res) => {
  try {
    const { data, slip, deviceName } = req.body;

    if (!data?.length) {
      throw new Error("Data is empty!");
    }

    const bulkData = data.map((item) => {
      const oneWayKanban = new OneWayKanbanProcessed(item.imgData);
      const formattedDate = moment(item.timeScan).format("YYYY-MM-DD");
      const formattedTime = moment(item.timeScan).format("HH:mm:ss");

      return {
        SLIP: slip || null,
        NPK: item.NPK,
        PARTNO: oneWayKanban.getTotalPartNumber(),
        QTY: oneWayKanban.getQtyPerKanban(),
        WH: oneWayKanban.getWhCode(),
        SQ: oneWayKanban.getUniqueCode(),
        TGL: formattedDate,
        JAM: formattedTime,
        FLAG: 3,
        FILENAME: item.processId || null,
        FLAGDX: 0,
        DEVICE_NAME: deviceName || null,
      };
    });

    // Bulk insert ke database (MAIN PROCESS)
    await STOCKOUT_T_TRANSACTION.bulkCreate(bulkData, { returning: false });

    // Setelah bulkCreate sukses, jalankan Redis queue secara fire-and-forget
    // Error pada Redis tidak akan mempengaruhi response
    const BATCH_SIZE = 25;
    const totalBatches = Math.ceil(data.length / BATCH_SIZE);

    for (let index = 0; index < data.length; index += BATCH_SIZE) {
      const batchData = data.slice(index, index + BATCH_SIZE);
      const batchNumber = Math.floor(index / BATCH_SIZE);

      stockoutQueue
        .add({
          data: batchData,
          NPK: batchData[0].NPK,
          timeScan: batchData[0].timeScan,
          batchNumber: batchNumber,
          totalBatches: totalBatches,
          batchSize: batchData.length,
        })
        .catch((error) => {
          console.error("Redis queue error (non-blocking):", error);
        });
    }

    res.status(200).json({
      msg: "Stockout Success",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({
      msg: "Stockout Failed!",
      errMsg: error,
    });
  }
};
