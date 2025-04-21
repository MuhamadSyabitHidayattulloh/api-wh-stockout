import { literal, Op } from "sequelize";
import { OneWayKanbanProcessed } from "../functions/OneWayKanbanProcessed.js";
import LS_T_LOT_FORM from "../Models/LS_T_LOT_FORM.js";
import STOCKOUT_T_TRANSACTION_2 from "../Models/STOCKOUT_T_TRANSACTION_2.js";
import {
  getLocationPart,
  getLineIdPart,
  getDataMasterLotSizing,
  getDataLotForm,
} from "../Models/warehouse.js";
import moment from "moment";
import WH_T_TEMPORARY from "../Models/WH_T_TEMPORARY.js";
import WH_T_FIFO from "../Models/WH_T_FIFO.js";

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
            kbn_std: lotSizeData.std_kbn_ro,
            qty_scan: lotSizeData.qty_scan,
            kbn_lot: lotSizeData.qty_after_ls,
            create_by: NPK,
            create_date: timeScan,
            line_id: lotSizeData.ls_table,
            wh_code: whCode,
            qty_lot: lotSizeData.qty_lot,
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

  static async lotFormDataProcess(lotFormData) {
    try {
      for (const item of lotFormData) {
        // console.log("Data yang kita terima yagesya: ", item.partno);
        try {
          const currentDataLotForm = await LS_T_LOT_FORM.findOne({
            attributes: [
              "kbn_scan",
              "kbn_std",
              "qty_scan",
              "kbn_lot",
              "partno",
              "line_id",
              "status",
              "wh_code",
              "id",
            ],
            where: {
              partno: item.partno,
              status: { [Op.eq]: 0 },
              wh_code: item.wh_code,
              line_id: item.line_id,
            },
          });

          // console.log("Data yang saat ini ada di table: ", currentDataLotForm);

          if (currentDataLotForm) {
            const kbn_scan = currentDataLotForm.kbn_scan + 1;
            if (kbn_scan == item.kbn_std) {
              await LS_T_LOT_FORM.update(
                {
                  kbn_scan: kbn_scan,
                  status: 1,
                  update_by: item.create_by,
                  update_date: literal("GETDATE()"),
                },
                {
                  where: {
                    id: currentDataLotForm.id,
                  },
                }
              );
              console.log("Disini pak");
            } else {
              await LS_T_LOT_FORM.update(
                {
                  kbn_scan: kbn_scan,
                  update_by: item.create_by,
                  update_date: literal("GETDATE()"),
                },
                {
                  where: {
                    id: currentDataLotForm.id,
                  },
                }
              );
              console.log("Ada disini sekarang pak");
            }
          } else {
            if (item.kbn_std == 1) {
              await LS_T_LOT_FORM.create({
                partno: item.partno,
                kbn_scan: 1,
                kbn_lot: item.kbn_lot,
                kbn_std: item.kbn_std,
                create_by: item.create_by,
                create_date: literal("GETDATE()"),
                line_id: item.line_id,
                qty_scan: item.qty_scan,
                wh_code: item.wh_code,
                status: 1,
              });
              console.log("Waduh pak");
            } else {
              await LS_T_LOT_FORM.create({
                partno: item.partno,
                kbn_scan: 1,
                kbn_lot: item.kbn_lot,
                kbn_std: item.kbn_std,
                create_by: item.create_by,
                create_date: literal("GETDATE()"),
                line_id: item.line_id,
                qty_scan: item.qty_scan,
                wh_code: item.wh_code,
              });
              console.log("Betul pak");
            }
          }
        } catch (error) {
          console.log("ada error saat proses lot form: ", error);
        }
      }
    } catch (error) {
      console.log("ada error saat proses lot looping: ", error);
    }
  }

  static async stockoutTemporaryData(data) {
    try {
      // console.log(data);
      for (const item of data) {
        try {
          const imgData = item.imgData;
          // console.log(imgData);
          await WH_T_TEMPORARY.destroy({
            where: {
              imgdata: imgData,
            },
          });
        } catch (error) {
          console.log("ada error saat proses lot looping: ", error);
        }
      }
    } catch (error) {
      console.log("ada error saat proses delete data temporary: ", error);
    }
  }

  static async fifoChecking(data, NPK) {
    try {
      for (const item of data) {
        try {
          const imgData = item.imgData;
          const oldestData = await WH_T_TEMPORARY.findOne({
            attributes: [created_date],
            where: {
              partno: data.partno,
            },
            order: ["created_date", "DESC"],
          });
          const processedData = await WH_T_TEMPORARY.findOne({
            attributes: [
              storaging_id,
              qty,
              partno,
              store_location,
              created_date,
            ],
            where: {
              imgdata: imgData,
            },
          });

          const oldTime = new Date(oldestData.created_date);
          const processedTime = new Date(processedData.created_date);

          if (processedTime > oldTime) {
            await WH_T_FIFO.create({
              storaging_id: processedData.storaging_id,
              imgData: imgData,
              qty: processedData.qty,
              partno: processedData.partno,
              store_location: processedData.store_location,
              storage_date: processedData.created_date,
              create_by: NPK,
            });
          }
        } catch (error) {
          console.log("ada errror saat proses fifo checking looping: ", error);
        }
      }
    } catch (error) {
      console.log("ada error saat proses checking fifo: ", error);
    }
  }
}
