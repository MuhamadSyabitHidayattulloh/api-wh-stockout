// tests/services/AuthService.test.js - Enhanced with mock data
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { AuthService } from "../../services/AuthService.js";
import { createMockUser } from "../setup.js";

// Mock akan otomatis aktif dari setup.js
describe("AuthService", () => {
  let MASTER_LOGIN;

  beforeEach(() => {
    jest.clearAllMocks();
    // Import mock model (sudah di-mock di setup.js)
    MASTER_LOGIN = require("../../Models/MASTER_LOGIN.js").default;
  });

  describe("confirmLogin", () => {
    test("should return user data for valid credentials", async () => {
      // Gunakan mock data factory
      const mockUser = createMockUser({
        username: "testuser",
        stockout_wh_role: 1,
      });

      // Setup mock behavior
      MASTER_LOGIN.findOne.mockResolvedValue(mockUser);

      const result = await AuthService.confirmLogin({
        USERNAME: "testuser",
        PASSWORD: "password123",
      });

      expect(result).toEqual(mockUser);
      expect(MASTER_LOGIN.findOne).toHaveBeenCalledWith({
        where: expect.objectContaining({
          username: "testuser",
        }),
      });
    });

    test("should return null for invalid credentials", async () => {
      MASTER_LOGIN.findOne.mockResolvedValue(null);

      const result = await AuthService.confirmLogin({
        USERNAME: "invalid",
        PASSWORD: "wrong",
      });

      expect(result).toBeNull();
    });
  });
});
