// tests/routes/warehouse.test.js
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";
import warehouseRoutes from "../../Routes/warehouse.js";
import { createTestApp } from "../setup.js";

// Mock controller functions
jest.mock("../../Controller/warehouse.js", () => ({
  getPartCategoryShopping: jest.fn((req, res) => {
    res.status(200).json({
      status: "success",
      data: [
        { category_id: 1, category_name: "Category 1" },
        { category_id: 2, category_name: "Category 2" },
      ],
    });
  }),
  stoctkoutAndroidWHSystem: jest.fn((req, res) => {
    res.status(200).json({
      status: "success",
      message: "Stockout processed successfully",
      data: {
        processed: req.body.data?.length || 0,
        failed: 0,
      },
    });
  }),
}));

describe("Warehouse Routes", () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    app.use("/api/warehouse", warehouseRoutes);
    jest.clearAllMocks();
  });

  describe("GET /api/warehouse/testRoute", () => {
    test("should return test message", async () => {
      const response = await request(app).get("/api/warehouse/testRoute");

      expect(response.status).toBe(200);
      expect(response.text).toBe("PE DEVELOPMENT 2024");
    });
  });

  describe("POST /api/warehouse/getCategoryPart", () => {
    test("should get part categories successfully", async () => {
      const response = await request(app)
        .post("/api/warehouse/getCategoryPart")
        .send({
          partno: "TEST001",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveLength(2);
    });

    test("should handle empty request body", async () => {
      const response = await request(app)
        .post("/api/warehouse/getCategoryPart")
        .send({});

      expect(response.status).toBe(200);
    });
  });

  describe("POST /api/warehouse/stockoutAndroid", () => {
    test("should process stockout successfully", async () => {
      const mockStockoutData = [
        {
          imgData: "QR_CODE_DATA_1",
          timeScan: "2024-01-01T10:00:00Z",
        },
        {
          imgData: "QR_CODE_DATA_2",
          timeScan: "2024-01-01T10:05:00Z",
        },
      ];

      const response = await request(app)
        .post("/api/warehouse/stockoutAndroid")
        .send({
          data: mockStockoutData,
          NPK: "TEST_USER",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.processed).toBe(2);
    });

    test("should handle empty data array", async () => {
      const response = await request(app)
        .post("/api/warehouse/stockoutAndroid")
        .send({
          data: [],
          NPK: "TEST_USER",
        });

      expect(response.status).toBe(200);
      expect(response.body.data.processed).toBe(0);
    });

    test("should handle missing data field", async () => {
      const response = await request(app)
        .post("/api/warehouse/stockoutAndroid")
        .send({
          NPK: "TEST_USER",
        });

      expect(response.status).toBe(200);
    });
  });
});
