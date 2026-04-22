const { getParcoursRecommendations, restaurants, hotels } = require("../../data/mockData");

describe("mockData.getParcoursRecommendations (unit)", () => {
  test("filtre par ville (case-insensitive) et retourne 0..3 restaurants", () => {
    const out = getParcoursRecommendations({ city: "paris", includeHotels: false });
    expect(out).toHaveProperty("restaurants");
    expect(Array.isArray(out.restaurants)).toBe(true);
    expect(out.restaurants.length).toBeLessThanOrEqual(3);
    out.restaurants.forEach((r) => {
      expect(r.city.toLowerCase()).toBe("paris");
    });
  });

  test("quand includeHotels=true, retourne 0..2 hôtels dans la ville", () => {
    const out = getParcoursRecommendations({ city: "Paris", includeHotels: true });
    expect(out.hotels.length).toBeLessThanOrEqual(2);
    out.hotels.forEach((h) => {
      expect(h.city.toLowerCase()).toBe("paris");
    });
  });

  test("données source contiennent bien restaurants et hotels", () => {
    expect(restaurants.length).toBeGreaterThanOrEqual(15);
    expect(hotels.length).toBeGreaterThanOrEqual(6);
  });
});

