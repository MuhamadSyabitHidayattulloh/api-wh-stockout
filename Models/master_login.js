import { DataTypes } from "sequelize";
import { connectDBMasterSequelize } from "../Config/dbConnection.js";

const MASTER_LOGIN = connectDBMasterSequelize.define(
  "master_login",
  {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    company_code: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    plant_code: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    bu_code: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    asaichi_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    asaichi_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    empo_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    empo_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    esm_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    esm_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    twipcek_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    twipcek_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ssdx_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ssdx_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ditrac_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ditrac_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checksheet_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    checksheet_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dx_vero_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dx_vero_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dx_csi_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dx_csi_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dx_dota_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dx_dota_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DX_MYMEET_ROLE: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DX_MYMEET_LAST_LOGIN: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DX_EGAN_ROLE: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DX_EGAN_LAST_LOGIN: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    warehouse_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    warehouse_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DX_MOSFET_ROLE: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DX_MOSFET_LAST_LOGIN: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    stockout_wh_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stockout_wh_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    mizusumashi_surfers_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mizusumashi_surfers_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trace_apps_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    trace_apps_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    selfinotify_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    selfinotify_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    create_by: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    update_by: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dx_she_patrol_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dx_she_patrol_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
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
        fields: [{ name: "username" }],
      },
    ],
  }
);

export default MASTER_LOGIN;
