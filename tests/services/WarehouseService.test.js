// tests/services/WarehouseService.test.js
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { WarehouseService } from "../../services/warehouseService.js";
import { createMockPartData } from "../setup.js";

describe("WarehouseService", () => {
  let WH_M_PART_LOC, WH_M_PARTNO;

  beforeEach(() => {
    jest.clearAllMocks();
    WH_M_PART_LOC = require("../../Models/WH_M_PART_LOC.js").default;
    WH_M_PARTNO = require("../../Models/WH_M_PARTNO.js").default;
  });

  describe("getLocationPart", () => {
    test("should return part location successfully", async () => {
      const mockPartLoc = createMockPartData({
        partno: "TEST001",
        store_location: "A1-01",
      });

      WH_M_PART_LOC.findOne.mockResolvedValue(mockPartLoc);

      const result = await WarehouseService.getLocationPart("TEST001");

      expect(result).toBe("A1-01");
      expect(WH_M_PART_LOC.findOne).toHaveBeenCalledWith({
        where: { partno: "TEST001" },
        attributes: ["store_location"],
      });
    });

    test("should return empty string for non-existent part", async () => {
      WH_M_PART_LOC.findOne.mockResolvedValue(null);

      const result = await WarehouseService.getLocationPart("NONEXISTENT");

      expect(result).toBe("");
    });
  });
});
