import { DataTypes } from "sequelize";
import { connectDBMasterSequelize } from "../Config/dbConnection.js";

const MASTER_PLANT = connectDBMasterSequelize.define(
  "master_plant",
  {
    plant_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      primaryKey: true,
    },
    plant_name_alias: {
      type: DataTypes.CHAR(5),
      allowNull: false,
    },
    plant_name: {
      type: DataTypes.CHAR(50),
      allowNull: false,
    },
    company_code: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    active_flag: {
      type: DataTypes.CHAR(1),
      allowNull: false,
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
    tableName: "master_plant",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK__master_p__CCCD9BF307EE3FB5",
        unique: true,
        fields: [{ name: "plant_code" }],
      },
    ],
  }
);

export default MASTER_PLANT;
