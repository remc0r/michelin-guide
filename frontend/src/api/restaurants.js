export async function fetchRestaurants(params = {}) {
  const qs = new URLSearchParams();
  if (params.city) qs.set("city", params.city);
  if (params.q) qs.set("q", params.q);
  const url = `/api/restaurants${qs.toString() ? `?${qs.toString()}` : ""}`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Impossible de charger les restaurants");
  return resp.json();
}

export async function fetchRestaurantBySlug(slug) {
  const resp = await fetch(`/api/restaurants/${encodeURIComponent(slug)}`);
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error("Impossible de charger le restaurant");
  return resp.json();
}

