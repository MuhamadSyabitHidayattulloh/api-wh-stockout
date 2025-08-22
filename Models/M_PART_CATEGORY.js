// Models/M_PART_CATEGORY.js
import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const M_PART_CATEGORY = connectDBWarehouseSequelize.define(
  "M_PART_CATEGORY",
  {
    category_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    category_partno: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    product: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(100),
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
    tableName: "M_PART_CATEGORY",
    schema: "dbo",
    timestamps: false,
  }
);

export default M_PART_CATEGORY;
