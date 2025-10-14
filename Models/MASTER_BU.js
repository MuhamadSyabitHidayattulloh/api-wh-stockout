import { DataTypes } from "sequelize";
import { connectDBMasterSequelize } from "../Config/dbConnection.js";

const MASTER_BU = connectDBMasterSequelize.define(
  "master_bu",
  {
    uuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    bu_code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true,
    },
    bu_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bu_as: {
      type: DataTypes.STRING(50),
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
    product: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    product_code: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    dept_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dept: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    bu_name_alias: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    category_code: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    group_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    image_bu: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    section: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    active_flag: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    color: {
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
