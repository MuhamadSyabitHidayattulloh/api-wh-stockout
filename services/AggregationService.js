import { Op } from "sequelize";
import IWTR_T_ORDER from "../Models/IWTR_T_ORDER.js";
import IWTR_T_VIS_REQ_ORD from "../Models/IWTR_T_VIS_REQ_ORD.js";
import WH_M_CYCLE from "../Models/WH_M_CYCLE.js";
import { connectDBIWTRSequelize as sequelize } from "../Config/dbConnection.js";
import websocketClientService from "./websocketClientService.js";
import moment from "moment";

export class AggregationService {
  static async updateCycleChartData() {
    try {
      const wib = moment().utcOffset("+07:00");
      const today = wib.format("YYYY-MM-DD");
      const todayFormatted = wib.format("YYYY-MM-DD");

      const cycles = await WH_M_CYCLE.findAll({
        where: { active_flag: true },
        attributes: ["cycle_id"],
        raw: true,
      });

      const orderStats = await IWTR_T_ORDER.findAll({
        where: {
          REQUEST_DATE: today.replaceAll("-", ""),
          [Op.or]: [{ STATUS: null }, { STATUS: { [Op.ne]: "S" } }],
        },
        attributes: [
          [sequelize.col("CYCLE_ID"), "cycle"],
          [
            sequelize.literal(
              "ISNULL(SUM(CASE WHEN STATUS NOT IN ('P', 'C') OR STATUS IS NULL THEN 1 ELSE 0 END), 0)",
            ),
            "waitingLotForm",
          ],
          [
            sequelize.literal(
              "ISNULL(SUM(CASE WHEN STATUS = 'P' THEN 1 ELSE 0 END), 0)",
            ),
            "scanRO",
          ],
          [
            sequelize.literal(
              "ISNULL(SUM(CASE WHEN STATUS = 'C' THEN 1 ELSE 0 END), 0)",
            ),
            "actualDelivery",
          ],
        ],
        group: ["CYCLE_ID"],
        raw: true,
      });

      const orderStatsMap = {};
      for (const stat of orderStats) {
        orderStatsMap[stat.cycle] = stat;
      }

      const result = cycles.map((c) => {
        const stats = orderStatsMap[String(c.cycle_id)] || {};
        return {
          cycle: c.cycle_id,
          waitingLotForm: stats.waitingLotForm || 0,
          scanRO: stats.scanRO || 0,
          actualDelivery: stats.actualDelivery || 0,
        };
      });

      for (const row of result) {
        const existing = await IWTR_T_VIS_REQ_ORD.findOne({
          where: {
            cycle: row.cycle,
            tanggal: todayFormatted,
          },
          attributes: ["id"],
        });

        if (existing) {
          await IWTR_T_VIS_REQ_ORD.update(
            {
              "waiting lot form": row.waitingLotForm,
              "scan ro": row.scanRO,
              "actual delivery": row.actualDelivery,
              update_date: new Date(),
              update_by: "SYSTEM",
            },
            {
              where: {
                cycle: row.cycle,
                tanggal: todayFormatted,
              },
            },
          );
        } else {
          const maxId = await IWTR_T_VIS_REQ_ORD.max("id");
          const nextId = (maxId || 0) + 1;
          await IWTR_T_VIS_REQ_ORD.create({
            id: nextId,
            tanggal: todayFormatted,
            cycle: row.cycle,
            "waiting lot form": row.waitingLotForm,
            "scan ro": row.scanRO,
            "actual delivery": row.actualDelivery,
            create_date: new Date(),
            active_flag: true,
          });
        }
      }

      console.log(`✅ Cycle chart data updated for ${todayFormatted}`);

      this.broadcastCycleChartUpdateToDashboard(result, todayFormatted);

      return true;
    } catch (error) {
      console.error("❌ Error updating cycle chart data:", error);
      throw error;
    }
  }

  static broadcastCycleChartUpdateToDashboard(data, tanggal) {
    try {
      if (websocketClientService.isConnected()) {
        websocketClientService.notifyDashboard("cycle_chart_updated", {
          data,
          tanggal,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to broadcast cycle chart update:", error);
    }
  }
}
