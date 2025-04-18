import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";
import { DataTypes } from "sequelize";

const WH_T_TEMPORARY = connectDBWarehouseSequelize.define(
  "WH_T_TEMPORARY",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    storaging_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imgdata: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    partno: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    store_location: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    create_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    update_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    active_flag: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
  },
  {
    tableName: "WH_T_TEMPORARY",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "partnoAndCreatedate",
        fields: [{ name: "partno" }, { name: "create_date" }],
      },
      {
        name: "partnoAndStore",
        fields: [{ name: "partno" }, { name: "store_location" }],
      },
      {
        name: "partnoIndex",
        fields: [{ name: "partno" }],
      },
      {
        name: "PK__WH_T_TEM__3213E83F33962C2C",
        unique: true,
        fields: [{ name: "id" }],
      },
      {
        name: "qyt",
        fields: [{ name: "qty" }],
      },
      {
        name: "storeLoc",
        fields: [{ name: "store_location" }],
      },
    ],
  }
);

export default WH_T_TEMPORARY;
