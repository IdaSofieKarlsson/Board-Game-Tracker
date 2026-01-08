import request from "supertest";
import { createApp } from "../src/app";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./testDb";

// Mock auth middleware
jest.mock("../src/middleware/auth");

describe("ME routes", () => {
  const app = createApp();

  beforeAll(async () => {
    await connectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  it("GET /api/me returns default profile", async () => {
    const res = await request(app).get("/api/me");

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body.username).toBeNull();
    expect(res.body.funFact).toBeNull();
  });

  it("PATCH /api/me updates username and funFact", async () => {
    const res = await request(app)
      .patch("/api/me")
      .send({ username: "Ida", funFact: "Plays board games." });

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("Ida");
    expect(res.body.funFact).toBe("Plays board games.");

    // verify GET reflects change
    const res2 = await request(app).get("/api/me");
    expect(res2.status).toBe(200);
    expect(res2.body.username).toBe("Ida");
  });
});
