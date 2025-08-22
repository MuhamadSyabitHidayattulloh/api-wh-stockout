import { timeStamp } from "console";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

// ✅ CONSISTENT: Semua sebagai direct instance
export const connectDBMasterSequelize = new Sequelize(
  process.env.DB_MASTER_NAME,
  process.env.DB_MASTER_USERNAME,
  process.env.DB_MASTER_PASSWORD,
  {
    host: process.env.DB_MASTER_SERVER,
    dialect: "mssql",
    logging: false,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      options: {
        encrypt: true, // ✅ CONSISTENT: Sama dengan yang lain
        trustServerCertificate: true,
      },
    },
  }
);

export const connectDBWarehouseSequelize = new Sequelize(
  process.env.DB_WH_NAME,
  process.env.DB_WH_USERNAME,
  process.env.DB_WH_PASSWORD,
  {
    host: process.env.DB_WH_SERVER,
    dialect: "mssql",
    logging: false,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true,
        useUTC: false,
        timeZone: "+00:00"
      },
    },
  },
);

export const connectDBStoragingSequelize = new Sequelize(
  process.env.DB_STORAGE_NAME,
  process.env.DB_STORAGE_USERNAME,
  process.env.DB_STORAGE_PASSWORD,
  {
    host: process.env.DB_STORAGE_SERVER,
    dialect: "mssql",
    logging: false,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    },
  }
);
