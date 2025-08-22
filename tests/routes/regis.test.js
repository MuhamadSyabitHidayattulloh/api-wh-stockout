// tests/routes/regis.test.js
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";
import regisRoutes from "../../Routes/regis.js";
import { createTestApp, generateTestToken } from "../setup.js";

// Mock dependencies
jest.mock("../../services/RegistrationService.js", () => ({
  RegistrationService: {
    checkUserExists: jest.fn(),
    updateUserRole: jest.fn(),
    getCompanies: jest.fn(),
    getPlants: jest.fn(),
    registerNewUser: jest.fn(),
    getUserRegistrationInfo: jest.fn(),
    updateStockoutRole: jest.fn(),
    validateRegistration: jest.fn(),
  },
}));

describe("Registration Routes", () => {
  let app;
  let RegistrationService;

  beforeEach(() => {
    app = createTestApp();
    app.use("/api/regis", regisRoutes);

    jest.clearAllMocks();
    RegistrationService =
      require("../../services/RegistrationService.js").RegistrationService;
  });

  describe("POST /api/regis/checkNpk", () => {
    test("should check user exists successfully", async () => {
      const mockUserCheck = {
        exists: true,
        username: "testuser",
        stockout_wh_role: 1,
      };

      RegistrationService.checkUserExists.mockResolvedValue(mockUserCheck);

      const response = await request(app)
        .post("/api/regis/checkNpk")
        .send({ userID: "testuser" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("userExisted");
    });

    test("should return user not found", async () => {
      RegistrationService.checkUserExists.mockResolvedValue({ exists: false });

      const response = await request(app)
        .post("/api/regis/checkNpk")
        .send({ userID: "newuser" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("userNotFound");
    });

    test("should validate userID input", async () => {
      const response = await request(app)
        .post("/api/regis/checkNpk")
        .send({ userID: "ab" }); // Too short

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Validation failed");
    });
  });

  describe("GET /api/regis/showCompany", () => {
    test("should return companies list", async () => {
      const mockCompanies = [
        { company_code: "COMP1", company_name: "Company 1" },
        { company_code: "COMP2", company_name: "Company 2" },
      ];

      RegistrationService.getCompanies.mockResolvedValue(mockCompanies);

      const response = await request(app).get("/api/regis/showCompany");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockCompanies);
    });
  });

  describe("GET /api/regis/showPlant", () => {
    test("should return plants list", async () => {
      const mockPlants = [
        { plant_code: "PLT1", plant_name: "Plant 1" },
        { plant_code: "PLT2", plant_name: "Plant 2" },
      ];

      RegistrationService.getPlants.mockResolvedValue(mockPlants);

      const response = await request(app).get("/api/regis/showPlant");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockPlants);
    });
  });

  describe("POST /api/regis/registerNew", () => {
    test("should register new user successfully", async () => {
      const mockResult = {
        success: true,
        username: "newuser",
      };

      RegistrationService.registerNewUser.mockResolvedValue(mockResult);

      const response = await request(app).post("/api/regis/registerNew").send({
        userID: "newuser",
        password: "password123",
        name: "New User",
        company: "COMP1",
        plant: "PLT1",
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
    });

    test("should validate registration input", async () => {
      const response = await request(app).post("/api/regis/registerNew").send({
        userID: "ab", // Too short
        password: "123", // Too short
        name: "A", // Too short
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Validation failed");
    });
  });

  describe("POST /api/regis/updateRole", () => {
    test("should update user role with authentication", async () => {
      const token = generateTestToken();
      RegistrationService.updateUserRole.mockResolvedValue(true);

      const response = await request(app)
        .post("/api/regis/updateRole")
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "testuser",
          role: 2,
        });

      expect(response.status).toBe(200);
    });

    test("should require authentication", async () => {
      const response = await request(app).post("/api/regis/updateRole").send({
        username: "testuser",
        role: 2,
      });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/regis/testRoute", () => {
    test("should return test message", async () => {
      const response = await request(app).get("/api/regis/testRoute");

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe("Registration service test route");
    });
  });
});
