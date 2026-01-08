import request from "supertest";
import { createApp } from "../src/app";
import { connectTestDb, clearTestDb, disconnectTestDb } from "./testDb";

jest.mock("../src/middleware/auth");

describe("Games routes", () => {
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

  it("POST /api/games creates a game, second POST returns 409 duplicate", async () => {
    const create1 = await request(app)
      .post("/api/games")
      .send({ name: "Catan", category: "BRADSPEL" });

    expect(create1.status).toBe(201);
    expect(create1.body.name).toBe("Catan");

    const create2 = await request(app)
      .post("/api/games")
      .send({ name: "  cAtAn  ", category: "BRADSPEL" });

    expect(create2.status).toBe(409);
    expect(create2.body.code).toBe("GAME_ALREADY_EXISTS");
    expect(create2.body.game.name).toBe("Catan");
  });

  it("GET /api/games returns sorted list", async () => {
    await request(app).post("/api/games").send({ name: "B", category: "ANNAT" });
    await request(app).post("/api/games").send({ name: "A", category: "ANNAT" });

    const res = await request(app).get("/api/games");
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("A");
    expect(res.body[1].name).toBe("B");
  });
});
