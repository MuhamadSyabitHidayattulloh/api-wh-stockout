import { DataTypes } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const MASTER_BU = connectDBWarehouseSequelize.define(
  "master_bu",
  {
    bu_code: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true,
    },
    bu_name: {
      type: DataTypes.CHAR(50),
      allowNull: false,
    },
    bu_name_alias: {
      type: DataTypes.CHAR(15),
      allowNull: true,
    },
    bu_product: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    category_code: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    group_code: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
    image_bu: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    company_code: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    plant_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      primaryKey: true,
    },
    section: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    dept_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    create_by: {
      type: DataTypes.CHAR(7),
      allowNull: false,
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    update_by: {
      type: DataTypes.CHAR(7),
      allowNull: false,
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    active_flag: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    active_estock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "master_bu",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK__master_b__D7E1622AE112C724",
        unique: true,
        fields: [{ name: "plant_code" }, { name: "bu_code" }],
      },
    ],
  }
);

export default MASTER_BU;
