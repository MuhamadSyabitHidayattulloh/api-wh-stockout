import { DataTypes } from "sequelize";
import { connectDBMasterSequelize } from "../Config/dbConnection.js";

const MASTER_COMPANY = connectDBMasterSequelize.define(
  "master_company",
  {
    company_code: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.CHAR(50),
      allowNull: true,
    },
    company_name_as: {
      type: DataTypes.CHAR(5),
      allowNull: true,
    },
    active_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
    },
    create_by: {
      type: DataTypes.CHAR(7),
      allowNull: true,
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    update_by: {
      type: DataTypes.CHAR(7),
      allowNull: true,
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "master_company",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK__master_c__F4E508EBFD76BECD",
        unique: true,
        fields: [{ name: "company_code" }],
      },
    ],
  }
);

export default MASTER_COMPANY;
