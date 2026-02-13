import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const WH_M_CYCLE = connectDBWarehouseSequelize.define(
  "WH_M_CYCLE",
  {
    cycle_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    cycle_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cycle_etd: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    cycle_eta: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "WH_M_CYCLE",
    schema: "WAREHOUSE",
    timestamps: false,
  },
);

export default WH_M_CYCLE;
