// Models/WH_M_PART_LOC.js
import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const WH_M_PART_LOC = connectDBWarehouseSequelize.define(
  "WH_M_PART_LOC",
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
    store_location: {
      type: DataTypes.STRING(20),
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
    tableName: "WH_M_PART_LOC",
    schema: "dbo",
    timestamps: false,
  }
);

export default WH_M_PART_LOC;
