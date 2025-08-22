// Models/WH_M_PARTNO.js
import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const WH_M_PARTNO = connectDBWarehouseSequelize.define(
  "WH_M_PARTNO",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    partno: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    part_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ls_table: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    qty_lot: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    qty_scan: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    std_kbn_ro: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lot_sizing: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    qty_after_ls: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "WH_M_PARTNO",
    schema: "dbo",
    timestamps: false,
  }
);

export default WH_M_PARTNO;
