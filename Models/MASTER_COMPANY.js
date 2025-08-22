// Models/MASTER_COMPANY.js
import { DataTypes } from "sequelize";
import { connectDBMasterSequelize } from "../Config/dbConnection.js";

const MASTER_COMPANY = connectDBMasterSequelize.define(
  "MASTER_COMPANY",
  {
    company_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    company_name_as: {
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
    active_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "Y",
    },
  },
  {
    tableName: "master_company",
    schema: "dbo",
    timestamps: false,
  }
);

export default MASTER_COMPANY;
