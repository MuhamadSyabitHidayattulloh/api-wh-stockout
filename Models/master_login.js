import { DataTypes } from "sequelize";
import { connectDBMasterSequelize } from "../Config/dbConnection.js";

const master_login = connectDBMasterSequelize.define(
  "master_login",
  {
    username: {
      type: DataTypes.CHAR(10),
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
    short_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    company_code: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    plant_code: {
      type: DataTypes.CHAR(5),
      allowNull: false,
    },
    bu_code: {
      type: DataTypes.CHAR(10),
      allowNull: false,
    },
    eprop_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    eprop_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    empas_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    empas_last_login: {
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
    ecrem_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ecrem_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    incek_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    incek_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sopdx_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sopdx_approve: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sopdx_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    e_pm_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    e_pm_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ekic_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ekic_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    astendy_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    astendy_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    epds_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    epds_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    emgstck_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    emgstck_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dconter_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dconter_last_login: {
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
    asaichi_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    asaichi_last_login: {
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
    tstock_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tstock_last_login: {
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
    warehouse_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    warehouse_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dx_vero_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    line_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ip_add: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    leader: {
      type: DataTypes.CHAR(10),
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
    active_flag: {
      type: DataTypes.CHAR(10),
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
    misuzumashi_surfers_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    misuzumashi_surfers_last_login: {
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
  },
  {
    tableName: "master_login",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK__master_l__F3DBC5734E4E056C",
        unique: true,
        fields: [{ name: "username" }],
      },
    ],
  }
);

export default master_login;
