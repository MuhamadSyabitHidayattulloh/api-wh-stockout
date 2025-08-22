// tests/basic.test.js
import { describe, test, expect } from "@jest/globals";
import { createMockUser, createMockPartData } from "./setup.js";

describe("Basic Functionality Tests", () => {
  test("should pass basic test", () => {
    expect(true).toBe(true);
  });

  test("should add numbers correctly", () => {
    expect(2 + 3).toBe(5);
    expect(10 - 5).toBe(5);
    expect(3 * 4).toBe(12);
  });

  test("should work with strings", () => {
    expect("hello".toUpperCase()).toBe("HELLO");
    expect("WORLD".toLowerCase()).toBe("world");
    expect("test".length).toBe(4);
  });

  test("should work with arrays", () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(1);
    expect(arr.includes(2)).toBe(true);
  });

  test("should work with objects", () => {
    const obj = { name: "test", value: 123 };
    expect(obj.name).toBe("test");
    expect(obj.value).toBe(123);
    expect(Object.keys(obj)).toHaveLength(2);
  });

  test("should create mock user data", () => {
    const user = createMockUser();
    expect(user.username).toBe("testuser");
    expect(user.id).toBe(1);
    expect(user.stockout_wh_role).toBe(1);
  });

  test("should create mock part data", () => {
    const part = createMockPartData();
    expect(part.partno).toBe("TEST001");
    expect(part.qty_lot).toBe(100);
    expect(part.store_location).toBe("A1-01");
  });

  test("should test environment variables", () => {
    expect(process.env.NODE_ENV).toBe("test");
    expect(process.env.JWT_SECRET).toBe("test-secret-key-12345");
  });
});
