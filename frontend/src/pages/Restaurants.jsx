import React, { useEffect, useMemo, useState } from "react";
import { restaurants as mockRestaurants, filters, cities } from "../mock";
import RestaurantCard from "../components/RestaurantCard";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { fetchRestaurants } from "../api/restaurants";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchRestaurants();
        if (!cancelled && Array.isArray(list) && list.length) setRestaurants(list);
      } catch (e) {
        // fallback: garder les mocks
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const filtered = useMemo(() => {
    let list = [...restaurants];
    if (query) list = list.filter(r => `${r.name} ${r.chef} ${r.city} ${r.cuisine}`.toLowerCase().includes(query.toLowerCase()));
    if (selectedCity) list = list.filter(r => r.city === selectedCity);
    if (selectedStars.length) list = list.filter(r => {
      return selectedStars.some(s => s === "bib" ? r.bibGourmand : r.stars === parseInt(s));
    });
    if (selectedPrice.length) list = list.filter(r => selectedPrice.includes(r.priceRange));
    if (sort === "rating") list.sort((a,b) => b.rating - a.rating);
    if (sort === "price-low") list.sort((a,b) => a.price - b.price);
    if (sort === "price-high") list.sort((a,b) => b.price - a.price);
    return list;
  }, [restaurants, query, selectedCity, selectedStars, selectedPrice, sort]);

  const clearAll = () => { setSelectedStars([]); setSelectedPrice([]); setSelectedCity(""); setQuery(""); };
  const activeCount = selectedStars.length + selectedPrice.length + (selectedCity ? 1 : 0) + (query ? 1 : 0);

  return (
    <div className="pt-[104px] min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-8">
        <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">Le guide</div>
        <h1 className="text-5xl md:text-7xl font-bold leading-none">Tous les <em className="text-gradient-red">restaurants</em></h1>
        <p className="text-[#6B6B6B] mt-4 text-lg max-w-2xl">{restaurants.length} adresses curatées. Filtre, trie, trouve ton prochain coup de cœur.</p>
      </div>

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-[#EAE6DF] p-2 flex flex-wrap md:flex-nowrap items-center gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 min-w-[200px]">
            <Search className="w-5 h-5 text-[#6B6B6B]" />
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Chercher un chef, une cuisine..." className="flex-1 outline-none bg-transparent" />
          </div>
          <select value={selectedCity} onChange={e=>setSelectedCity(e.target.value)} className="px-4 py-3 rounded-xl bg-[#FFF8F0] outline-none text-sm font-medium cursor-pointer">
            <option value="">Toutes villes</option>
            {cities.map(c => <option key={c.name}>{c.name}</option>)}
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="px-4 py-3 rounded-xl bg-[#FFF8F0] outline-none text-sm font-medium cursor-pointer">
            <option value="relevance">Pertinence</option>
            <option value="rating">Mieux notés</option>
            <option value="price-low">Prix ↗</option>
            <option value="price-high">Prix ↘</option>
          </select>
        </div>
      </div>

      {/* Filter pills */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mr-2">
          <SlidersHorizontal className="w-4 h-4"/> Filtres
        </div>
        {filters.stars.map(s => (
          <button key={s.value} onClick={() => toggle(selectedStars, setSelectedStars, s.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedStars.includes(s.value) ? "bg-[#1A1A1A] text-[#FFF8F0] border-[#1A1A1A]" : "bg-white text-[#1A1A1A] border-[#EAE6DF] hover:border-[#1A1A1A]"}`}>
            {s.label}
          </button>
        ))}
        {filters.priceRanges.map(p => (
          <button key={p} onClick={() => toggle(selectedPrice, setSelectedPrice, p)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedPrice.includes(p) ? "bg-[#C8102E] text-white border-[#C8102E]" : "bg-white text-[#1A1A1A] border-[#EAE6DF] hover:border-[#C8102E]"}`}>
            {p}
          </button>
        ))}
        {activeCount > 0 && (
          <button onClick={clearAll} className="ml-2 inline-flex items-center gap-1 text-sm text-[#C8102E] font-semibold">
            <X className="w-4 h-4"/> Effacer ({activeCount})
          </button>
        )}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-[#6B6B6B]">{filtered.length} résultat{filtered.length>1?"s":""}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#EAE6DF]">
            <div className="text-6xl mb-4">⋯</div>
            <h3 className="text-2xl font-bold">Rien trouvé</h3>
            <p className="text-[#6B6B6B] mt-2">Essaie d'élargir tes filtres.</p>
            <button onClick={clearAll} className="btn-primary mt-6">Réinitialiser</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(r => <RestaurantCard key={r.id} r={r} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
