import STOCKOUT_ERROR_LOG from "../Models/STOCKOUT_ERROR_LOG.js";
import { Op } from "sequelize";
import moment from "moment";

export const getErrorLogs = async (req, res) => {
  try {
    const {
      status = "PENDING",
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const where = { STATUS: status };

    if (startDate && endDate) {
      where.ERROR_DATE = {
        [Op.between]: [startDate, endDate],
      };
    }

    const logs = await STOCKOUT_ERROR_LOG.findAndCountAll({
      where,
      order: [["ERROR_DATE", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    res.json({
      data: logs.rows,
      total: logs.count,
      page: parseInt(page),
      totalPages: Math.ceil(logs.count / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch error logs",
      error: error.message,
    });
  }
};

export const updateErrorLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, resolvedBy } = req.body;

    await STOCKOUT_ERROR_LOG.update(
      {
        STATUS: status,
        RESOLUTION_NOTES: resolutionNotes,
        RESOLVED_BY: resolvedBy,
        RESOLVED_DATE:
          status === "RESOLVED" ? moment().format("YYYY-MM-DD HH:mm:ss") : null,
      },
      {
        where: { ID: id },
      }
    );

    res.json({ message: "Error log updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update error log",
      error: error.message,
    });
  }
};
