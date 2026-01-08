import request from "supertest";
import { createApp } from "../src/app";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./testDb";

jest.mock("../src/middleware/auth");

describe("Sessions + Stats", () => {
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

  it("POST /api/sessions creates sessions and stats sums points + favorite", async () => {
    const g1 = await request(app).post("/api/games").send({ name: "Catan", category: "BRADSPEL" });
    const g2 = await request(app).post("/api/games").send({ name: "Azul", category: "BRADSPEL" });

    const game1Id = g1.body._id;
    const game2Id = g2.body._id;

    await request(app).post("/api/sessions").send({ gameId: game1Id, result: "WIN" });  // 2
    await request(app).post("/api/sessions").send({ gameId: game1Id, result: "LOSS" }); // 0
    await request(app).post("/api/sessions").send({ gameId: game2Id, result: "TIE" });  // 1

    const stats = await request(app).get("/api/stats/overview");
    expect(stats.status).toBe(200);
    expect(stats.body.totalPoints).toBe(3);
    expect(stats.body.favoriteGameId).toBe(game1Id); // 2 sessions vs 1
  });

  it("POST /api/sessions rejects future playedAt", async () => {
    const g = await request(app).post("/api/games").send({ name: "Catan", category: "BRADSPEL" });
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const res = await request(app)
      .post("/api/sessions")
      .send({ gameId: g.body._id, result: "WIN", playedAt: future });

    expect(res.status).toBe(400);
  });
});
