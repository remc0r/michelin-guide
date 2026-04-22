const request = require("supertest");

const { createApp } = require("../../server");

describe("API (integration)", () => {
  /** @type {import('express').Express} */
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test("GET /api/ retourne Hello World", async () => {
    const res = await request(app).get("/api/").expect(200);
    expect(res.body).toEqual({ message: "Hello World" });
  });

  test("GET /api/parcours retourne restaurants pour une ville", async () => {
    const res = await request(app)
      .get("/api/parcours")
      .query({ city: "Paris", group_type: "ville", moment: "diner" })
      .expect(200);

    expect(res.body).toHaveProperty("restaurants");
    expect(Array.isArray(res.body.restaurants)).toBe(true);
    res.body.restaurants.forEach((r) => expect(r.city).toBe("Paris"));
  });

  test("GET /api/parcours inclut des hôtels quand group_type=voyage", async () => {
    const res = await request(app)
      .get("/api/parcours")
      .query({ city: "Paris", group_type: "voyage", moment: "diner" })
      .expect(200);

    expect(Array.isArray(res.body.hotels)).toBe(true);
  });

  test("/api/status renvoie 503 si Mongo non configuré", async () => {
    const postRes = await request(app)
      .post("/api/status")
      .send({ client_name: "test" });

    // Selon environnement CI/local, Mongo peut être configuré.
    // On vérifie donc simplement: soit 200 avec shape attendue, soit 503 avec error.
    if (postRes.status === 200) {
      expect(postRes.body).toHaveProperty("id");
      expect(postRes.body).toHaveProperty("client_name", "test");
      expect(postRes.body).toHaveProperty("timestamp");
    } else {
      expect(postRes.status).toBe(503);
      expect(postRes.body).toHaveProperty("error");
    }
  });
});

