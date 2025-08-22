// Models/M_PART_CATEGORY_MAPPING.js
import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const M_PART_CATEGORY_MAPPING = connectDBWarehouseSequelize.define(
  "M_PART_CATEGORY_MAPPING",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    child_partno: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    line_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "M_PART_CATEGORY_MAPPING",
    schema: "dbo",
    timestamps: false,
  }
);

export default M_PART_CATEGORY_MAPPING;
