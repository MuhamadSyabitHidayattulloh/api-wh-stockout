import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const STOCKOUT_ERROR_LOG = connectDBWarehouseSequelize.define(
  "STOCKOUT_ERROR_LOG",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NPK: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    ERROR_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ERROR_TYPE: {
      type: DataTypes.STRING(20), // PROCESS_ERROR, LOT_ERROR, SYSTEM_ERROR
      allowNull: false,
    },
    ERROR_MESSAGE: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    RAW_DATA: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    STATUS: {
      type: DataTypes.STRING(10), // PENDING, RESOLVED, IGNORED
      defaultValue: "PENDING",
    },
    RESOLUTION_NOTES: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    RESOLVED_BY: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    RESOLVED_DATE: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CREATED_AT: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "STOCKOUT_ERROR_LOG",
    timestamps: false,
  }
);

export default STOCKOUT_ERROR_LOG;
