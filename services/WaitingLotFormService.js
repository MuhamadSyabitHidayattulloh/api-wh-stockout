import { Op } from "sequelize";
import LS_T_LOT_FORM from "../Models/LS_T_LOT_FORM.js";
import websocketClientService from "./websocketClientService.js";

export class WaitingLotFormService {
  static async fetchWaitingLotFormData(partnoFilter = null) {
    try {
      const whereConditions = {
        status: 0,
        active_flag: true,
      };

      if (partnoFilter) {
        whereConditions.partno = { [Op.like]: `%${partnoFilter}%` };
      }

      const lotForms = await LS_T_LOT_FORM.findAll({
        where: whereConditions,
        attributes: [
          "id",
          "partno",
          "kbn_std",
          "kbn_scan",
          "create_date",
          "line_id",
        ],
        order: [["create_date", "ASC"]],
        raw: true,
      });

      const result = lotForms.map((row, index) => {
        const kbnScan = row.kbn_scan || 0;
        const kbnStd = row.kbn_std || 0;
        const lotForm = `${kbnScan}/${kbnStd}`;
        const lotStandardVal = `${kbnStd}/${kbnStd}`;
        const isComplete = kbnScan === kbnStd;

        return {
          no: index + 1,
          partNumber: row.partno,
          lotStandard: lotStandardVal,
          lotForm,
          status: isComplete ? "complete" : "in_progress",
        };
      });

      return result;
    } catch (error) {
      console.error("❌ Error fetching waiting lot form data:", error);
      throw error;
    }
  }

  static broadcastWaitingLotFormUpdateToDashboard(data) {
    try {
      if (websocketClientService.isConnected()) {
        websocketClientService.notifyDashboard("waiting_lot_form_updated", {
          data,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to broadcast waiting lot form update:", error);
    }
  }

  static async updateAndBroadcastWaitingLotForm() {
    try {
      const data = await this.fetchWaitingLotFormData();
      this.broadcastWaitingLotFormUpdateToDashboard(data);
      console.log("✅ Waiting lot form data broadcasted");
    } catch (error) {
      console.error(
        "❌ Error updating and broadcasting waiting lot form:",
        error,
      );
    }
  }
}
