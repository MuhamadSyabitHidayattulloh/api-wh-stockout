import { OneWayKanbanProcessed } from "../functions/OneWayKanbanProcessed.js";
import STOCKOUT_T_TRANSACTION_2 from "../Models/STOCKOUT_T_TRANSACTION_2.js";
import {
  getLocationPart,
  getLineIdPart,
  getDataMasterLotSizing
} from "../Models/warehouse.js"
import moment from "moment";

export class StockoutService {
  static async processStockoutData(data, NPK, timeScan) {
    const processedData = [];
    const failedProcessedData = [];
    const lotFormData = [];
    const failedLotData = [];

    // Proses setiap data
    for (const item of data) {
      try {
        const qrKanban = new OneWayKanbanProcessed(item.imgData);
        const pattern = "NO INST";
        const partno = qrKanban.getPartNumber();
        const uniqueId = qrKanban.getUniqueCode();
        const qty = qrKanban.getQtyPerKanban();
        const partLoc = await getLocationPart(partno); 
        const partLineId = await getLineIdPart(partno);
        const whCode = qrKanban.getWhCode();
        const lotSizeData = await getDataMasterLotSizing(partno);

        processedData.push({
          pattern: pattern,
          idbox_no: item.imgData,
          timescan_idbox: timeScan,
          partno: partno,
          kbn_seq: uniqueId,
          qty_kbn_std: qty,
          qty_kbn_act: 1,
          wh_loc: partLoc,
          line_id: partLineId,
          operator: NPK,
          status: 1,
          complete: 1,
          create_by: NPK,
          create_date: timeScan,
          wh_code: whCode,
        });

        if (lotSizeData.lot_sizing > 0) {
          lotFormData.push({
            partno: partno,
            kbn_scan: 1,
            kbn_std: lotSizeData.std_kbn_ro,
            qty_scan: lotSizeData.qty_scan,
            kbn_lot: lotSizeData.qty_after_ls,
            create_by: NPK,
            create_date: timeScan,
            line_id: lotSizeData.ls_table,
            wh_code: whCode,
            status: 1,
          });
        }
      } catch (error) {
        failedProcessedData.push({
          ...item,
          error: error.message,
        });
      }
    }

    return {
      processedData,
      failedProcessedData,
      lotFormData,
      failedLotData,
    };
  }

  static async updateFlagDX(NPK, timeScan) {
    await STOCKOUT_T_TRANSACTION_2.update(
      { FLAGDX: 1 },
      {
        where: {
          NPK: NPK,
          TGL: moment(timeScan).format("YYYY-MM-DD"),
          FLAGDX: 0,
        },
      }
    );
  }
}
