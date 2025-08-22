// tests/routes/login.test.js
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import loginRoutes from "../../Routes/login.js";
import { createMockRequest, createMockResponse } from "../setup.js";

// Mock dependencies
jest.mock("../../services/AuthService.js", () => ({
  AuthService: {
    confirmLogin: jest.fn(),
    validateToken: jest.fn(),
    changePassword: jest.fn(),
  },
}));

jest.mock("../../Validation/loginValidation.js", () => ({
  loginValidation: [
    (req, res, next) => next(), // Mock validation middleware
  ],
}));

jest.mock("../../Validation/loginValidationQr.js", () => ({
  loginValidationQR: [
    (req, res, next) => next(), // Mock validation middleware
  ],
}));

describe("Login Routes", () => {
  let app;
  let AuthService;

  beforeEach(() => {
    app = createTestApp();
    app.use("/api/login", loginRoutes);

    // Reset mocks
    jest.clearAllMocks();

    // Import mocked AuthService
    AuthService = require("../../services/AuthService.js").AuthService;
  });

  describe("POST /api/login/Stockout/confirmLogin", () => {
    test("should login successfully with valid credentials", async () => {
      const mockUser = {
        username: "testuser",
        id: 1,
        stockout_wh_role: 1,
      };

      AuthService.confirmLogin.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/login/Stockout/confirmLogin")
        .send({
          USERNAME: "testuser",
          PASSWORD: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(AuthService.confirmLogin).toHaveBeenCalledWith({
        USERNAME: "testuser",
        PASSWORD: "password123",
      });
    });

    test("should return 401 for invalid credentials", async () => {
      AuthService.confirmLogin.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/login/Stockout/confirmLogin")
        .send({
          USERNAME: "invaliduser",
          PASSWORD: "wrongpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("msg");
    });

    test("should return 500 for server error", async () => {
      AuthService.confirmLogin.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/api/login/Stockout/confirmLogin")
        .send({
          USERNAME: "testuser",
          PASSWORD: "password123",
        });

      expect(response.status).toBe(500);
    });
  });

  describe("POST /api/login/Stockout/confirmLoginQr", () => {
    test("should login successfully with QR code", async () => {
      const mockUser = {
        username: "testuser",
        id: 1,
        stockout_wh_role: 1,
      };

      AuthService.confirmLogin.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/login/Stockout/confirmLoginQr")
        .send({
          qrData: "encoded_qr_data",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("POST /api/login/Stockout/validateToken", () => {
    test("should validate token successfully", async () => {
      const token = generateTestToken();

      const response = await request(app)
        .post("/api/login/Stockout/validateToken")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    test("should return 401 for missing token", async () => {
      const response = await request(app).post(
        "/api/login/Stockout/validateToken"
      );

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/login/testRoute", () => {
    test("should return test message", async () => {
      const response = await request(app).get("/api/login/testRoute");

      expect(response.status).toBe(200);
      expect(response.text).toContain("PE Development 2024");
    });
  });
});
