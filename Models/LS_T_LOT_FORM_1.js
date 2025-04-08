import { DataTypes, Sequelize } from "sequelize";
import { connectDBWarehouseSequelize } from "../Config/dbConnection.js";

const LS_T_LOT_FORM_1 = connectDBWarehouseSequelize.define(
  "LS_T_LOT_FORM_1",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    partno: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kbn_scan: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    kbn_std: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    qty_scan: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    kbn_lot: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    create_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("GETDATE()"),
    },
    update_by: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("GETDATE()"),
    },
    active_flag: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
    line_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    cycle_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wh_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "LS_T_LOT_FORM_1",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "<Name ofewxw34ing Index,rd4dname,>",
        fields: [{ name: "status" }],
      },
      {
        name: "<Nasdfadf, syvewvqevame,>",
        fields: [{ name: "line_id" }, { name: "status" }],
      },
      {
        name: "PK_LS_W_LOT_FORM_1",
        unique: true,
        fields: [{ name: "id" }],
      },
    ],
  }
);

export default LS_T_LOT_FORM_1;
