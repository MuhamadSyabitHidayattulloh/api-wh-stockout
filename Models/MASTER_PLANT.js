// Models/MASTER_PLANT.js
import { DataTypes } from "sequelize";
import { connectDBMasterSequelize } from "../Config/dbConnection.js";

const MASTER_PLANT = connectDBMasterSequelize.define(
  "MASTER_PLANT",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    plant_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    plant_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    company_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "Y",
    },
  },
  {
    tableName: "master_plant",
    schema: "dbo",
    timestamps: false,
  }
);

export default MASTER_PLANT;
