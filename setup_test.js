// tests/setup.js - Test setup and utilities
import { jest } from "@jest/globals";
import { dotenv } from "dotenv";

const result = dotenv.config({ path: "env.test" });
console.log("ini env: ", result);

console.log("🧪 Test Environment:", {
  NODE_ENV: process.env.NODE_ENV,
  DB_MASTER_NAME: process.env.DB_MASTER_NAME,
  DB_WH_NAME: process.env.DB_WH_NAME,
  JWT_SECRET: process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing",
});

// Test utilities
export const createMockUser = (overrides = {}) => ({
  id: 1,
  username: "testuser",
  password: "hashedpassword",
  name: "Test User",
  stockout_wh_role: 1,
  company: "TEST_COMPANY",
  plant: "TEST_PLANT",
  created_date: new Date(),
  updated_date: new Date(),
  ...overrides,
});

export const createMockPartData = (overrides = {}) => ({
  id: 1,
  partno: "TEST001",
  part_name: "Test Part",
  qty_lot: 100,
  ls_table: 1,
  store_location: "A1-01",
  ...overrides,
});

export const createMockStockoutData = (overrides = {}) => ({
  transaction_id: "TXN001",
  partno: "TEST001",
  qty: 10,
  imgdata: "QR_CODE_DATA",
  pattern: "NO INST",
  created_date: new Date(),
  ...overrides,
});

export const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  ...overrides,
});
