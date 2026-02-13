import { DataTypes } from "sequelize";
import { connectDBIWTRSequelize } from "../Config/dbConnection.js";

const IWTR_T_ORDER = connectDBIWTRSequelize.define(
  "IWTR_T_ORDER",
  {
    WAREHOUSE_FROM: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    WAREHOUSE_TO: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    REQUEST_NO: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      allowNull: false,
    },
    LINE_NO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      defaultValue: 1,
    },
    LOT_FORM_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    REQUEST_DATE: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    DELIVERY_DATE: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    CYCLE_ID: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    CYCLE_ETD: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    CYCLE_ETA: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    PARTNO: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    PART_NAME: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ORDER_QTY: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    TAG_QTY: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    DELIVERY_QTY: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    STATUS: {
      type: DataTypes.CHAR(1),
      allowNull: true,
    },
    WHLOCFROM: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    WHLOCTO: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ITCLS: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    ITTYP: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    UNMSR: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    MULQY: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    LOTSZ: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: true,
    },
    USER_EMP_ID: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    REQUEST_TIME: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
  },
  {
    tableName: "IWTR_T_ORDER",
    schema: "IWTR",
    timestamps: false,
  },
);

export default IWTR_T_ORDER;
