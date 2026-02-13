import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const IWTR_T_VIS_REQ_ORD = connectDBWarehouseSequelize.define(
  "IWTR_T_VIS_REQ_ORD",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    shift: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cycle: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    "waiting lot form": {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "waiting lot form",
    },
    "scan ro": {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "scan ro",
    },
    "actual delivery": {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "actual delivery",
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    update_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "IWTR_T_VIS_REQ_ORD",
    schema: "WAREHOUSE",
    timestamps: false,
  },
);

export default IWTR_T_VIS_REQ_ORD;
