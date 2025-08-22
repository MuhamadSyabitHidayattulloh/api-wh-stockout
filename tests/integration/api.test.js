// tests/integration/api.test.js
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../../index.js"; // Main app

describe("API Integration Tests", () => {
  beforeAll(async () => {
    // Setup database connections or mock them
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    // Cleanup
  });

  test("should start server without errors", async () => {
    const response = await request(app).get("/api/login/testRoute");

    expect(response.status).toBe(200);
  });

  test("should handle CORS properly", async () => {
    const response = await request(app).options("/api/login/testRoute");

    expect(response.headers).toHaveProperty("access-control-allow-origin");
  });

  test("should handle 404 for unknown routes", async () => {
    const response = await request(app).get("/api/unknown/route");

    expect(response.status).toBe(404);
  });
});
