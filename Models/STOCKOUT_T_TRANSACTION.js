import { DataTypes } from 'sequelize';
import { connectDBWarehouseSequelize } from '../Config/dbConnection.js';

const STOCKOUT_T_TRANSACTION = connectDBWarehouseSequelize.define(
  "STOCKOUT_T_TRANSACTION",{
    SLIP: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    NPK: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    SERIAL: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    PARTNO: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true
    },
    QTY: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    WH: {
      type: DataTypes.STRING(1),
      allowNull: false,
      primaryKey: true
    },
    SQ: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    TGL: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    JAM: {
      type: DataTypes.STRING(8),
      allowNull: false,
      primaryKey: true
    },
    FLAG: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    FILENAME: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    NEWSLIP: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    FLAGDX: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IP_ADDRESS: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    DEVICE_NAME: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'STOCKOUT_T_TRANSACTION',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_STOCKOUT_T_TRANSACTION",
        unique: true,
        fields: [
          { name: "SLIP" },
          { name: "PARTNO" },
          { name: "WH" },
          { name: "SQ" },
          { name: "TGL" },
          { name: "JAM" },
        ]
      },
    ]
  })

  export default STOCKOUT_T_TRANSACTION