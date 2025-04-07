import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const STOCKOUT_T_TRANSACTION_2 = connectDBWarehouseSequelize.define(
  "STOCKOUT_T_TRANSACTION_2",
  {
    SLIP: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    NPK: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    SERIAL: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    PARTNO: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    QTY: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    WH: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    SQ: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    TGL: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    JAM: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    FLAG: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: 0,
    },
    FILENAME: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    NEWSLIP: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    FLAGDX: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "STOCKOUT_T_TRANSACTION_2",
    schema: "dbo",
    timestamps: false,
  }
);

export default STOCKOUT_T_TRANSACTION_2;
