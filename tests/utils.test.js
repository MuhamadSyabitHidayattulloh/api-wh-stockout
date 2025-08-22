// tests/utils.test.js
import { describe, test, expect } from "@jest/globals";

describe("Utility Functions", () => {
  describe("Date Functions", () => {
    test("should format date correctly", () => {
      const formatDate = (date) => {
        return date.toISOString().split("T")[0];
      };

      const date = new Date("2024-01-01T10:30:00Z");
      expect(formatDate(date)).toBe("2024-01-01");
    });

    test("should get current timestamp", () => {
      const getTimestamp = () => {
        return new Date().toISOString();
      };

      const timestamp = getTimestamp();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe("Validation Functions", () => {
    test("should validate part number", () => {
      const validatePartNumber = (partno) => {
        return partno && typeof partno === "string" && partno.length > 0;
      };

      expect(validatePartNumber("TEST001")).toBe(true);
      expect(validatePartNumber("")).toBe(false);
      expect(validatePartNumber(null)).toBe(false);
      expect(validatePartNumber(undefined)).toBe(false);
    });

    test("should validate email format", () => {
      const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });

    test("should validate username", () => {
      const validateUsername = (username) => {
        return (
          username && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username)
        );
      };

      expect(validateUsername("testuser")).toBe(true);
      expect(validateUsername("user123")).toBe(true);
      expect(validateUsername("ab")).toBe(false);
      expect(validateUsername("user@name")).toBe(false);
    });
  });

  describe("Calculation Functions", () => {
    test("should calculate quantity", () => {
      const calculateQty = (qtyPerKanban, numberOfKanban) => {
        return qtyPerKanban * numberOfKanban;
      };

      expect(calculateQty(10, 5)).toBe(50);
      expect(calculateQty(0, 5)).toBe(0);
      expect(calculateQty(7, 3)).toBe(21);
    });

    test("should calculate inventory", () => {
      const calculateInventory = (current, incoming, outgoing) => {
        return current + incoming - outgoing;
      };

      expect(calculateInventory(100, 50, 20)).toBe(130);
      expect(calculateInventory(0, 100, 0)).toBe(100);
      expect(calculateInventory(50, 0, 25)).toBe(25);
    });
  });

  describe("String Functions", () => {
    test("should generate unique ID", () => {
      const generateId = () => {
        return "TXN" + Date.now();
      };

      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toContain("TXN");
      expect(id2).toContain("TXN");
      expect(id1).not.toBe(id2);
    });

    test("should format location code", () => {
      const formatLocation = (area, row, position) => {
        return `${area}${row}-${position.toString().padStart(2, "0")}`;
      };

      expect(formatLocation("A", "1", "5")).toBe("A1-05");
      expect(formatLocation("B", "2", "10")).toBe("B2-10");
    });
  });
});
