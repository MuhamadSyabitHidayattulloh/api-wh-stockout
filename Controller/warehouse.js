import moment from "moment";
import { OneWayKanbanProcessed } from "../functions/OneWayKanbanProcessed.js";
import STOCKOUT_T_TRANSACTION_2 from "../Models/STOCKOUT_T_TRANSACTION_2.js";
import stockoutQueue from "../queues/stockoutProcessor.js";
import { WarehouseService } from "../services/warehouseService.js";

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
    const data = req.body.data;
    const slip = req.body.slip;

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
        FLAG: 0,
        FILENAME: item.processId || null,
        FLAGDX: 0,
      };
    });
    // Bulk insert ke database
    await STOCKOUT_T_TRANSACTION_2.bulkCreate(bulkData, { returning: false });

    await stockoutQueue.add({
      data: data,
      NPK: data[0].NPK,
      timeScan: data[0].timeScan,
    });

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
