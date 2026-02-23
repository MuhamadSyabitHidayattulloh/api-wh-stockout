// services/StockoutService.js - Fixed import path
import { literal, Op, Transaction } from "sequelize";
import LS_T_LOT_FORM from "../Models/LS_T_LOT_FORM.js";
import STOCKOUT_T_TRANSACTION from "../Models/STOCKOUT_T_TRANSACTION.js";
import IWTR_T_ORDER from "../Models/IWTR_T_ORDER.js";
import WH_M_PARTNO from "../Models/WH_M_PARTNO.js";
import WH_M_CYCLE from "../Models/WH_M_CYCLE.js";
import { WarehouseService } from "./WarehouseService.js";
import { AggregationService } from "./AggregationService.js";
import { WaitingLotFormService } from "./WaitingLotFormService.js";
import moment from "moment";
import WH_T_TEMPORARY from "../Models/WH_T_TEMPORARY.js";
import WH_T_FIFO from "../Models/WH_T_FIFO.js";
import { OneWayKanbanProcessed } from "../functions/OneWayKanbanProcessed.js";

export class StockoutService {
  static async generateRequestNo() {
    const wib = moment().utcOffset("+07:00");
    const datePart = wib.format("YYYYMMDD");
    const timePart =
      wib.format("HHmmss") +
      Math.floor(wib.millisecond() / 10)
        .toString()
        .padStart(2, "0");
    return `R23${datePart}${timePart}T`;
  }

  static async createIWTROrder(
    lotFormId,
    partno,
    createBy,
    createDate,
    transaction = null,
  ) {
    try {
      const partMaster = await WH_M_PARTNO.findOne({
        where: { partno: partno },
        attributes: [
          "partno",
          "part_name",
          "std_lot_form",
          "qty_after_ls",
          "class_id",
          "type_id",
          "measure_id",
          "wh_location",
          "qty_lot",
        ],
        raw: true,
      });

      if (!partMaster) {
        console.log(`Part master not found for partno: ${partno}`);
        return null;
      }

      const wib = moment(createDate).utcOffset("+07:00");
      const requestDate = wib.format("YYYYMMDD");
      const requestTime = wib.format("HHmm");

      const cycle = await WH_M_CYCLE.findOne({
        where: { active_flag: true },
        attributes: ["cycle_id", "cycle_etd", "cycle_eta"],
        raw: true,
      });

      if (!cycle) {
        console.log("No active cycle found");
        return null;
      }

      const requestNo = await this.generateRequestNo();

      const iwtrOrderData = {
        REQUEST_NO: requestNo,
        LINE_NO: 1,
        LOT_FORM_ID: lotFormId,
        WAREHOUSE_FROM: "2",
        WAREHOUSE_TO: "3",
        REQUEST_DATE: requestDate,
        DELIVERY_DATE: requestDate,
        CYCLE_ID: cycle.cycle_id,
        CYCLE_ETD: cycle.cycle_etd,
        CYCLE_ETA: cycle.cycle_eta,
        PARTNO: partno,
        PART_NAME: partMaster.part_name,
        ORDER_QTY: partMaster.qty_lot * partMaster.std_lot_form,
        TAG_QTY: partMaster.qty_lot,
        MULQY: partMaster.std_lot_form,
        LOTSZ: partMaster.qty_after_ls,
        STATUS: "P",
        USER_EMP_ID: createBy,
        REQUEST_TIME: requestTime,
        ITCLS: partMaster.class_id,
        ITTYP: partMaster.type_id,
        UNMSR: partMaster.measure_id,
        WHLOCFROM: partMaster.wh_location,
      };

      const createdOrder = await IWTR_T_ORDER.create(iwtrOrderData, {
        transaction: transaction,
      });
      console.log(`Created IWTR order: ${requestNo} for partno: ${partno}`);
      return createdOrder;
    } catch (error) {
      console.error(`Error creating IWTR order for partno ${partno}:`, error);
      throw error;
    }
  }

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

        // Use WarehouseService methods
        const partLoc = await WarehouseService.getLocationPart(partno);
        const partLineId = await WarehouseService.getLineIdPart(partno);
        const lotSizeData =
          await WarehouseService.getDataMasterLotSizing(partno);
        const whCode = qrKanban.getWhCode();

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

  // Add method to execute stockout using WarehouseService
  static async executeStockout(processedData) {
    try {
      return await WarehouseService.stockOutWithoutInstruction(processedData);
    } catch (error) {
      console.error("Error executing stockout", error);
      throw error;
    }
  }

  static async updateFlagDX(NPK, timeScan) {
    await STOCKOUT_T_TRANSACTION.update(
      { FLAGDX: 1 },
      {
        where: {
          NPK: NPK,
          TGL: moment(timeScan).format("YYYY-MM-DD"),
          FLAGDX: 0,
        },
      },
    );
  }

  static async lotFormDataProcess(lotFormData) {
    try {
      const partsToAggregateOnCommit = new Set();

      for (const item of lotFormData) {
        const transaction = await LS_T_LOT_FORM.sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });

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
            transaction,
            lock: transaction.LOCK.UPDATE,
          });

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
                  transaction,
                },
              );

              await this.createIWTROrder(
                currentDataLotForm.id,
                item.partno,
                item.create_by,
                item.create_date,
                transaction,
              );

              partsToAggregateOnCommit.add(item.partno);
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
                  transaction,
                },
              );
            }
          } else if (item.kbn_std == 1) {
            const createdLotForm = await LS_T_LOT_FORM.create(
              {
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
              },
              { transaction },
            );

            await this.createIWTROrder(
              createdLotForm.id,
              item.partno,
              item.create_by,
              item.create_date,
              transaction,
            );

            partsToAggregateOnCommit.add(item.partno);
          } else {
            await LS_T_LOT_FORM.create(
              {
                partno: item.partno,
                kbn_scan: 1,
                kbn_lot: item.kbn_lot,
                kbn_std: item.kbn_std,
                create_by: item.create_by,
                create_date: literal("GETDATE()"),
                line_id: item.line_id,
                qty_scan: item.qty_scan,
                wh_code: item.wh_code,
              },
              { transaction },
            );
          }

          await transaction.commit();
        } catch (error) {
          await transaction.rollback();
          console.log("ada error saat proses lot form: ", error);
        }
      }

      // Trigger aggregation SETELAH semua commits berhasil - aggregation baca data terbaru
      if (partsToAggregateOnCommit.size > 0) {
        await this.updateCycleChartAggregation(
          Array.from(partsToAggregateOnCommit),
        );
      }

      await WaitingLotFormService.updateAndBroadcastWaitingLotForm();
    } catch (error) {
      console.log("ada error saat proses lot looping: ", error);
    }
  }

  static async updateCycleChartAggregation(partnosArray) {
    try {
      const parts = Array.isArray(partnosArray) ? partnosArray : [partnosArray];
      console.log(
        `Triggering aggregation AFTER commit for ${parts.length} part(s): ${parts.join(", ")}`,
      );
      await AggregationService.updateCycleChartData();
    } catch (error) {
      console.error("Error triggering cycle chart aggregation:", error);
    }
  }

  static async stockoutTemporaryData(data) {
    try {
      for (const item of data) {
        try {
          const imgData = item.imgData;
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

          const processedData = await WH_T_TEMPORARY.findOne({
            attributes: [
              "storaging_id",
              "qty",
              "partno",
              "store_location",
              "create_date",
            ],
            where: {
              imgdata: imgData,
            },
          });

          if (processedData) {
            const oldestData = await WH_T_TEMPORARY.findOne({
              attributes: ["create_date"],
              where: {
                partno: processedData.partno,
              },
              order: [["create_date", "ASC"]],
            });

            const oldTime = new Date(oldestData.create_date);
            const processedTime = new Date(processedData.create_date);

            const diffHours = moment(processedTime).diff(
              moment(oldTime),
              "hours",
            );

            if (diffHours > 24) {
              console.log("Tidak fifo bro - Selisih waktu: ", diffHours, "jam");
              await WH_T_FIFO.create({
                storaging_id: processedData.storaging_id,
                imgdata: imgData,
                qty: processedData.qty,
                partno: processedData.partno,
                store_location: processedData.store_location,
                storage_date: literal(
                  `CONVERT(DATETIME, '${moment(
                    processedData.create_date,
                  ).format("YYYY-MM-DD HH:mm:ss")}')`,
                ),
                create_by: NPK,
                create_date: literal("GETDATE()"),
              });
            }
          } else {
            console.log(
              `Skip FIFO check - No data found for imgdata: ${imgData}`,
            );
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
