import { DataTypes, Sequelize } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const WH_T_FIFO = connectDBWarehouseSequelize.define(
  "WH_T_FIFO",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    storaging_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imgdata: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partno: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    store_location: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    storage_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("getdate"),
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("getdate"),
    },
    create_by: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn("getdate"),
    },
    update_by: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    active_flag: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
  },
  {
    tableName: "WH_T_FIFO",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK_WH_T_FIFO",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  }
);

export default WH_T_FIFO;
