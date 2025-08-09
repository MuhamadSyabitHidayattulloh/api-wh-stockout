import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const DTD2_SEPARATION = connectDBWarehouseSequelize.define(
  "DTD2_SEPARATION",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    sj_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    trolley: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    partno: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    vndnr: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    slpno: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    imgdata: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    separation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    trf_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "DTD2_SEPARATION",
    schema: "dbo",
    timestamps: false,
  }
);

export default DTD2_SEPARATION;
