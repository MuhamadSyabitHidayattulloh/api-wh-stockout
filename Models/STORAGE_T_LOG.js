import { DataTypes } from "sequelize";
import { connectDBStoragingSequelize } from "../Config/dbConnection.js";

const STORAGE_T_LOG = connectDBStoragingSequelize.define(
  "STORAGE_T_LOG",
  {
    log_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    storaging_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    separation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    temp_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sj_code: {
      type: DataTypes.STRING(50),
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
    kanban_partno: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    store_id: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "STORAGE_T_LOG",
    schema: "dbo",
    timestamps: false,
  }
);

export default STORAGE_T_LOG;
