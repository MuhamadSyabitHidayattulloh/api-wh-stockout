import { DataTypes, Sequelize } from "sequelize";
import { connectDBMasterSequelize } from "../Config/dbConnection.js";

const MASTER_LOGIN = connectDBMasterSequelize.define(
  "MASTER_LOGIN",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    plant_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    stockout_wh_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    active_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: "Y",
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("GETDATE()"),
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("GETDATE()"),
    },
  },
  {
    tableName: "master_login",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK_master_login",
        unique: true,
        fields: [{ name: "id" }],
      },
      {
        name: "UQ_master_login_username",
        unique: true,
        fields: [{ name: "username" }],
      },
    ],
  }
);

export default MASTER_LOGIN;
