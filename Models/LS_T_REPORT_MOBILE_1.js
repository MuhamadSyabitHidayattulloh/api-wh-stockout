// Models/LS_T_REPORT_MOBILE_1.js
import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const LS_T_REPORT_MOBILE_1 = connectDBWarehouseSequelize.define(
  "LS_T_REPORT_MOBILE_1",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    pattern: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    idbox_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    timescan_idbox: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    partno: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kbn_seq: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    qty_kbn_std: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    qty_kbn_act: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wh_loc: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    line_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    operator: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    complete: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    create_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    wh_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "LS_T_REPORT_MOBILE_1",
    schema: "dbo",
    timestamps: false,
  }
);

export default LS_T_REPORT_MOBILE_1;
