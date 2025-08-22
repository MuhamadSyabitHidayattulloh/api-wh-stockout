// services/WarehouseService.js - Complete replacement for warehouse.js
import LS_T_REPORT_MOBILE_1 from "../Models/LS_T_REPORT_MOBILE_1.js";
import WH_M_PART_LOC from "../Models/WH_M_PART_LOC.js";
import WH_M_PARTNO from "../Models/WH_M_PARTNO.js";
import M_PART_CATEGORY from "../Models/M_PART_CATEGORY.js";
import M_PART_CATEGORY_MAPPING from "../Models/M_PART_CATEGORY_MAPPING.js";
import DTD2_SEPARATION from "../Models/DTD2_SEPARATION.js";
import STORAGE_T_LOG from "../Models/STORAGE_T_LOG.js";
import LS_T_LOT_FORM from "../Models/LS_T_LOT_FORM.js";
import WH_T_TEMPORARY from "../Models/WH_T_TEMPORARY.js";
import STOCKOUT_T_TRANSACTION_2 from "../Models/STOCKOUT_T_TRANSACTION_2.js";
import { Op } from "sequelize";

export class WarehouseService {
  // Complete stockout without instruction
  static async stockOutWithoutInstruction(data) {
    try {
      const result = data.map((item) => ({
        transaction_id: item.transaction_id,
        pattern: item.pattern,
        idbox_no: item.idbox_no,
        timescan_idbox: item.timescan_idbox,
        partno: item.partno,
        kbn_seq: item.kbn_seq,
        qty_kbn_std: item.qty_kbn_std,
        qty_kbn_act: item.qty_kbn_act,
        wh_loc: item.wh_loc,
        line_id: item.line_id,
        operator: item.operator,
        status: item.status,
        complete: item.complete,
        create_by: item.create_by,
        create_date: item.create_date,
        wh_code: item.wh_code,
      }));

      await LS_T_REPORT_MOBILE_1.bulkCreate(result);
      console.log(`✅ Inserted ${result.length} records`);
      return result;
    } catch (error) {
      console.error("Error stockOutWithoutInstruction", error);
      throw error;
    }
  }

  // Get location part
  static async getLocationPart(partno) {
    try {
      const result = await WH_M_PART_LOC.findOne({
        where: { partno: partno },
        attributes: ["store_location"],
      });

      return result ? result.store_location : "";
    } catch (error) {
      console.error("Error getLocationPart", error);
      throw error;
    }
  }

  // Get line ID part
  static async getLineIdPart(partno) {
    try {
      const result = await WH_M_PARTNO.findOne({
        where: {
          partno: {
            [Op.iLike]: `%${partno}%`,
          },
        },
        attributes: ["ls_table"],
      });

      if (!result) {
        const error = new Error("Part number not found");
        error.code = "PART_NOT_FOUND";
        throw error;
      }

      return result.ls_table || "";
    } catch (error) {
      if (!error.code) {
        error.code = "GET_LINE_ID_PART_ERROR";
      }
      throw error;
    }
  }

  // Get master lot sizing data
  static async getDataMasterLotSizing(partno) {
    try {
      const result = await WH_M_PARTNO.findOne({
        where: { partno: partno },
        attributes: [
          "qty_lot",
          "ls_table",
          "qty_scan",
          "std_kbn_ro",
          "lot_sizing",
          "qty_after_ls",
        ],
      });

      if (!result) {
        return {
          qty_lot: null,
          ls_table: null,
          qty_scan: null,
          std_kbn_ro: null,
          lot_sizing: null,
          qty_after_ls: null,
        };
      }

      return {
        qty_lot: result.qty_lot,
        ls_table: result.ls_table,
        qty_scan: result.qty_scan,
        std_kbn_ro: result.std_kbn_ro,
        lot_sizing: result.lot_sizing,
        qty_after_ls: result.qty_after_ls,
      };
    } catch (error) {
      console.error("Error getDataMasterLotsizing", error);
      throw error;
    }
  }

  // Get separation data by One Way Kanban
  static async getDataSeparationByOneWayKanbanModels(id) {
    try {
      const result = await DTD2_SEPARATION.findAll({
        where: { imgdata: id },
        attributes: [
          "id",
          "sj_code",
          "trolley",
          "partno",
          "vndnr",
          "slpno",
          "qty",
          "imgdata",
          "separation",
          "trf_date",
        ],
      });

      return { recordset: result };
    } catch (error) {
      console.error("Error getDataSeparationByOneWayKanbanModels", error);
      throw error;
    }
  }

  // Get storaging data by One Way Kanban
  static async getDataStoragingByOneWayKanbanModels(id) {
    try {
      const result = await STORAGE_T_LOG.findAll({
        where: { imgdata: id },
        attributes: [
          "log_id",
          "storaging_id",
          "separation_id",
          "temp_id",
          "sj_code",
          "imgdata",
          "qty",
          "kanban_partno",
          "store_id",
          "created_date",
          "created_by",
          "updated_date",
          "updated_by",
        ],
      });

      return { recordset: result };
    } catch (error) {
      console.error("Error getDataStoragingByOneWayKanbanModels", error);
      throw error;
    }
  }

  // Create lot sizing data
  static async createDataLotSizing(data) {
    try {
      const results = [];
      const failedData = [];

      for (const item of data) {
        try {
          const result = await LS_T_LOT_FORM.create(item);
          results.push(result);
        } catch (error) {
          failedData.push({ ...item, error: error.message });
        }
      }

      return { results, failedData, successCount: results.length };
    } catch (error) {
      console.error("Error createDataLotSizing", error);
      throw error;
    }
  }

  // Get category part
  static async getCategoryPart(categoryPartno) {
    try {
      const result = await M_PART_CATEGORY.findOne({
        where: { category_partno: categoryPartno },
        attributes: ["product", "model"],
      });

      return result || null;
    } catch (error) {
      console.error("Error getCategoryPart", error);
      throw error;
    }
  }

  // Get model and product shopping list
  static async getModelAndProductShoppingList(categoryPartno) {
    try {
      const result = await M_PART_CATEGORY.findOne({
        where: { category_partno: categoryPartno },
        attributes: ["model", "product"],
      });

      return {
        model: result ? result.model : null,
        product: result ? result.product : null,
      };
    } catch (error) {
      console.error("Error getModelAndProductShoppingList", error);
      throw error;
    }
  }

  // Get shopping list
  static async getShoppingList(partno) {
    try {
      const categoryData = await M_PART_CATEGORY.findOne({
        where: { category_partno: partno },
        attributes: ["category_id", "model", "product"],
      });

      if (!categoryData) {
        return [];
      }

      const childParts = await M_PART_CATEGORY_MAPPING.findAll({
        where: { category_id: categoryData.category_id },
        attributes: ["child_partno", "line_code", "qty"],
      });

      const detailChildPart = await Promise.all(
        childParts.map(async (item) => {
          const partData = await WH_M_PARTNO.findOne({
            where: { partno: item.child_partno },
            attributes: ["part_name"],
          });

          const partLocation = await WH_M_PART_LOC.findOne({
            where: { partno: item.child_partno },
            attributes: ["store_location"],
          });

          return {
            child_partno: item.child_partno,
            line_code: item.line_code,
            part_name: partData ? partData.part_name : null,
            part_loc: partLocation ? partLocation.store_location : null,
            qty: item.qty,
          };
        })
      );

      return detailChildPart;
    } catch (error) {
      console.error("Error getShoppingList", error);
      throw error;
    }
  }

  // Get data storage
  static async getDataStorage(data) {
    try {
      const result = await WH_T_TEMPORARY.findAll({
        where: {
          imgdata: {
            [Op.in]: data,
          },
        },
        attributes: ["storaging_id", "imgdata", "partno"],
      });

      return result;
    } catch (error) {
      console.error("Error getDataStorage", error);
      throw error;
    }
  }

  // Check data stockout
  static async checkDataStockout(data) {
    try {
      const result = await LS_T_REPORT_MOBILE_1.findOne({
        where: { idbox_no: data },
        attributes: ["idbox_no"],
      });

      return result ? true : false;
    } catch (error) {
      console.error("Error checkDataStockout", error);
      throw error;
    }
  }

  // Check data stockout misuzumashi
  static async checkDataStockoutMisuzumashi(data) {
    try {
      const result = await LS_T_REPORT_MOBILE_1.findOne({
        where: { idbox_no: data },
        attributes: ["idbox_no"],
      });

      return result ? true : false;
    } catch (error) {
      console.error("Error checkDataStockoutMisuzumashi", error);
      throw error;
    }
  }

  // Delete data storage
  static async deleteDataStorage(data) {
    try {
      const result = await WH_T_TEMPORARY.destroy({
        where: {
          imgdata: {
            [Op.in]: data,
          },
        },
      });

      return result;
    } catch (error) {
      console.error("Error deleteDataStorage", error);
      throw error;
    }
  }

  // Get last data stockout
  static async getLastDataStockOut() {
    try {
      const result = await STOCKOUT_T_TRANSACTION_2.findOne({
        attributes: ["SLIP", "FILENAME"],
        order: [
          ["TGL", "DESC"],
          ["JAM", "DESC"],
        ],
      });

      return result;
    } catch (error) {
      console.error("Error getLastDataStockOut", error);
      throw error;
    }
  }

  // Stockout misuzumashi models
  static async stockoutMisuzumashiModels(data) {
    try {
      const result = data.map((item) => ({
        transaction_id: item.transaction_id,
        pattern: item.pattern,
        idbox_no: item.idbox_no,
        timescan_idbox: item.timescan_idbox,
        partno: item.partno,
        kbn_seq: item.kbn_seq,
        qty_kbn_std: item.qty_kbn_std,
        qty_kbn_act: item.qty_kbn_act,
        wh_loc: item.wh_loc,
        line_id: item.line_id,
        operator: item.operator,
        status: item.status,
        complete: item.complete,
        create_by: item.create_by,
        create_date: item.create_date,
        wh_code: item.wh_code,
      }));

      const submit = await LS_T_REPORT_MOBILE_1.bulkCreate(result);
      console.log(`✅ Inserted ${result.length} misuzumashi records`);
      return submit;
    } catch (error) {
      console.error("Error stockoutMisuzumashiModels", error);
      throw error;
    }
  }
}
