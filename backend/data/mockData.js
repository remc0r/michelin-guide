/**
 * Données mockées — aucune API externe.
 * Les images sont des placeholders (à remplacer si besoin).
 */

/** @type {Array<{id:string,name:string,stars:1|2|3,city:string,cuisine:string,description:string,imageUrl:string,price_range:string}>} */
const restaurants = [
  {
    id: "r_paris_arakawa",
    name: "Arakawa",
    stars: 3,
    city: "Paris",
    cuisine: "Cuisine créative",
    description:
      "Une table d'auteur au service précis, entre classicisme et audace contrôlée.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },
  {
    id: "r_paris_camellia",
    name: "Camellia",
    stars: 2,
    city: "Paris",
    cuisine: "Gastronomique française",
    description:
      "Produits d'exception, sauces nettes et un jeu d'équilibre parfait.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },
  {
    id: "r_paris_les_ateliers",
    name: "Les Ateliers du Chef",
    stars: 1,
    city: "Paris",
    cuisine: "Bistronomie",
    description:
      "Une bistronomie contemporaine, élégante, à l'énergie maîtrisée.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€",
  },

  {
    id: "r_lyon_bellecour",
    name: "Bellecour",
    stars: 2,
    city: "Lyon",
    cuisine: "Cuisine lyonnaise",
    description:
      "Réinterprétation subtile des classiques lyonnais, grande maîtrise des cuissons.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },
  {
    id: "r_lyon_quais",
    name: "Les Quais",
    stars: 1,
    city: "Lyon",
    cuisine: "Cuisine de saison",
    description:
      "Une cuisine de marché, signature légère, au service d'une salle intimiste.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€",
  },
  {
    id: "r_lyon_nocturne",
    name: "Nocturne",
    stars: 3,
    city: "Lyon",
    cuisine: "Haute cuisine",
    description:
      "Grand style, assiettes sculptées, et une cave pensée comme une bibliothèque.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },

  {
    id: "r_bordeaux_garonne",
    name: "Garonne",
    stars: 2,
    city: "Bordeaux",
    cuisine: "Cuisine française",
    description:
      "Élégance bordelaise: produits du Sud-Ouest, sauces profondes et desserts précis.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },
  {
    id: "r_bordeaux_pavillon",
    name: "Le Pavillon",
    stars: 1,
    city: "Bordeaux",
    cuisine: "Cuisine contemporaine",
    description:
      "Un menu court, impeccable, avec de superbes accords vins.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€",
  },
  {
    id: "r_bordeaux_oceanique",
    name: "Océanique",
    stars: 3,
    city: "Bordeaux",
    cuisine: "Poissons & crustacés",
    description:
      "La mer en majesté: précision iodée, condiments justes et élégance sans effet.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },

  {
    id: "r_nice_promenade",
    name: "Promenade",
    stars: 2,
    city: "Nice",
    cuisine: "Méditerranéenne",
    description:
      "Cuisine solaire et raffinée, à l'huile d'olive et aux herbes fraîches.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },
  {
    id: "r_nice_citronnier",
    name: "Le Citronnier",
    stars: 1,
    city: "Nice",
    cuisine: "Cuisine niçoise",
    description:
      "Niçoise d'âme, contemporaine de geste: petits farcis, poissons, agrumes.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€",
  },
  {
    id: "r_nice_azur",
    name: "Azur",
    stars: 3,
    city: "Nice",
    cuisine: "Gastronomique",
    description:
      "Grande cuisine d'hôtel, service impeccable, et panorama sur la Riviera.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },

  {
    id: "r_tokyo_kiku",
    name: "Kiku",
    stars: 2,
    city: "Tokyo",
    cuisine: "Kaiseki",
    description:
      "Un kaiseki au tempo parfait, où chaque saison se raconte en silence.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },
  {
    id: "r_tokyo_edo",
    name: "Edo",
    stars: 1,
    city: "Tokyo",
    cuisine: "Sushi",
    description:
      "Sushi omakase, riz à la température idéale, gestes millimétrés.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },
  {
    id: "r_tokyo_kuro",
    name: "Kuro",
    stars: 3,
    city: "Tokyo",
    cuisine: "Yakitori",
    description:
      "Charbon binchotan, précision extrême, menu dégustation d'une rare subtilité.",
    imageUrl: "https://placehold.co/800x500?text=Restaurant",
    price_range: "€€€€",
  },
];

/** @type {Array<{id:string,name:string,city:string,description:string,stars_hotel:4|5,imageUrl:string}>} */
const hotels = [
  {
    id: "h_paris_palais",
    name: "Hôtel du Palais",
    city: "Paris",
    description: "Un palace feutré, design intemporel et service de haute couture.",
    stars_hotel: 5,
    imageUrl: "https://placehold.co/800x500?text=Hotel",
  },
  {
    id: "h_lyon_soie",
    name: "La Maison de la Soie",
    city: "Lyon",
    description: "Adresses confidentielles, tissus nobles, et petit-déjeuner d'exception.",
    stars_hotel: 5,
    imageUrl: "https://placehold.co/800x500?text=Hotel",
  },
  {
    id: "h_bordeaux_chais",
    name: "Les Chais d'Or",
    city: "Bordeaux",
    description: "Entre pierre blonde et chais revisités, un luxe discret.",
    stars_hotel: 4,
    imageUrl: "https://placehold.co/800x500?text=Hotel",
  },
  {
    id: "h_nice_riviera",
    name: "Riviera Grand Hôtel",
    city: "Nice",
    description: "Lumière, lignes pures, et terrasse sur la mer.",
    stars_hotel: 5,
    imageUrl: "https://placehold.co/800x500?text=Hotel",
  },
  {
    id: "h_tokyo_ginza",
    name: "Ginza Residence",
    city: "Tokyo",
    description: "Minimalisme luxueux, spa, et vue sur la ville.",
    stars_hotel: 5,
    imageUrl: "https://placehold.co/800x500?text=Hotel",
  },
  {
    id: "h_paris_edition",
    name: "L'Édition",
    city: "Paris",
    description: "Une adresse arty et élégante, parfaite pour une escapade.",
    stars_hotel: 4,
    imageUrl: "https://placehold.co/800x500?text=Hotel",
  },
];

/**
 * Mélange un tableau (Fisher–Yates) sans le muter.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Retourne un set de recommandations en fonction de la ville + option voyage.
 * @param {{city:string, includeHotels:boolean}} params
 * @returns {{restaurants: typeof restaurants, hotels: typeof hotels}}
 */
function getParcoursRecommendations(params) {
  const city = (params.city || "").trim();
  const includeHotels = Boolean(params.includeHotels);

  const restaurantsInCity = restaurants.filter(
    (r) => r.city.toLowerCase() === city.toLowerCase()
  );
  const hotelsInCity = hotels.filter(
    (h) => h.city.toLowerCase() === city.toLowerCase()
  );

  // Randomisation légère
  const pickedRestaurants = shuffled(restaurantsInCity).slice(0, 3);
  const pickedHotels = includeHotels ? shuffled(hotelsInCity).slice(0, 2) : [];

  return { restaurants: pickedRestaurants, hotels: pickedHotels };
}

module.exports = { restaurants, hotels, getParcoursRecommendations };

