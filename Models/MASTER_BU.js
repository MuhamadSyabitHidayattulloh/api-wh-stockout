// Models/MASTER_BU.js
import { DataTypes } from 'sequelize';
import { connectDBMasterSequelize } from '../Config/dbConnection.js';

const MASTER_BU = connectDBMasterSequelize.define(
  'MASTER_BU',
  {
    bu_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
    },
    bu_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bu_name_alias: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    company_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    plant_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    active_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'Y',
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'master_bu',
    schema: 'dbo',
    timestamps: false,
  },
);

export default MASTER_BU;
