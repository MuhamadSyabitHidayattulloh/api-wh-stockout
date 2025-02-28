import dotenv from "dotenv";
import knex from "knex";
import sql from "mssql";
import { Sequelize } from "sequelize";

dotenv.config();

const sqlConfigWarehouse = await knex({
  client: "mssql",
  connection: {
    user: process.env.DB_USERNAME_WH,
    password: process.env.DB_PASSWORD_WH,
    database: process.env.DB_NAME_WH,
    server: process.env.DB_SERVER_WH,
    pool: {
      max: 100,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: true, // change to true for local dev / self-signed certs
    },
  },
  pool: {
    min: 0,
    max: 10,
  },
});

export const connectDBWarehouse = () => {
  return sqlConfigWarehouse;
};

const sqlConfigStoraging = {
  user: process.env.DB_USERNAME_STORAGE,
  password: process.env.DB_PASSWORD_STORAGE,
  database: process.env.DB_NAME_STORAGE,
  server: process.env.DB_SERVER_STORAGE,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

export const connectDBStoraging = async (sqlQuery) => {
  const cPool = new sql.ConnectionPool(sqlConfigStoraging);
  cPool.on("error", (err) => console.log("---> SQL Error: ", err));

  try {
    await cPool.connect();
    try {
      let result = await cPool.request().query(sqlQuery);
      return result;
    } catch (error) {
      return error;
    }
  } catch (err) {
    return err;
  } finally {
    cPool.close(); // <-- closing connection in the end it's a key
  }
};

const sqlConfigMaster = {
  user: process.env.DB_USERNAME_MASTER,
  password: process.env.DB_PASSWORD_MASTER,
  database: process.env.DB_NAME_MASTER,
  server: process.env.SERVER_MASTER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};
export const connectDBMaster = async (sqlQuery) => {
  const cPool = new sql.ConnectionPool(sqlConfigMaster);
  cPool.on("error", (err) => console.log("---> SQL Error: ", err));

  try {
    await cPool.connect();
    try {
      let result = await cPool.request().query(sqlQuery);
      return result;
    } catch (error) {
      return error;
    }
  } catch (err) {
    return err;
  } finally {
    cPool.close(); // <-- closing connection in the end it's a key
  }
};

export const connectDBMasterSequelize = new Sequelize(
  process.env.DB_NAME_MASTER,
  process.env.DB_USERNAME_MASTER,
  process.env.DB_PASSWORD_MASTER,
  {
    host: process.env.SERVER_MASTER,
    dialect: "mssql",
    logging: false,
    dialectOptions: {
      encrypt: true,
      trustServerCertificate: true,
    },
  }
);
