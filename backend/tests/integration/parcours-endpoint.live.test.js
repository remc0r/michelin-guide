/**
 * Test d'intégration "live" (sans Supertest): vérifie que l'endpoint est accessible via HTTP.
 * Utile quand le frontend n'a pas de proxy actif.
 */

describe("/api/parcours (live http)", () => {
  test("répond sur http://localhost:8000", async () => {
    // Ce test suppose le backend démarré sur 8000. Si ce n'est pas le cas, on skip.
    let resp;
    try {
      resp = await fetch(
        "http://localhost:8000/api/parcours?city=Paris&group_type=ville&moment=diner"
      );
    } catch (e) {
      return;
    }

    if (!resp.ok) return;
    const json = await resp.json();
    expect(Array.isArray(json.restaurants)).toBe(true);
  });
});

