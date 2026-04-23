import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Bookmark } from "lucide-react";

const StarBadge = ({ count }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(count)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#C8102E]">
        <path d="M12 2l2.39 7.36H22l-6.18 4.49L18.21 22 12 17.51 5.79 22l2.39-8.15L2 9.36h7.61L12 2z"/>
      </svg>
    ))}
  </div>
);

const RestaurantCard = ({ r, variant = "default" }) => {
  if (variant === "editorial") {
    return (
      <Link to={`/restaurants/${r.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-[#EAE6DF]">
          <img src={r.image} alt={r.name} className="w-full h-full object-cover img-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <Bookmark className="w-4 h-4" />
          </button>
          {r.stars > 0 && (
            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full">
              <StarBadge count={r.stars} />
            </div>
          )}
          {r.bibGourmand && (
            <div className="absolute top-4 left-4 bg-[#F5C518] text-[#1A1A1A] px-3 py-1.5 rounded-full text-xs font-bold">BIB GOURMAND</div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="text-xs tracking-[0.2em] uppercase opacity-90 mb-1">{r.city} · {r.cuisine}</div>
            <h3 className="text-2xl font-bold leading-tight">{r.name}</h3>
            <div className="flex items-center gap-2 text-sm mt-1 opacity-90">
              <span>{r.chef}</span>
              <span>·</span>
              <span>{r.priceRange}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/restaurants/${r.slug}`} className="group block card-tilt">
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-[#EAE6DF] mb-4">
        <img src={r.image} alt={r.name} className="w-full h-full object-cover img-zoom" />
        <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center hover:scale-110 transition-transform" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <Bookmark className="w-4 h-4" />
        </button>
        {r.stars > 0 && (
          <div className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-full">
            <StarBadge count={r.stars} />
          </div>
        )}
        {r.bibGourmand && (
          <div className="absolute top-3 left-3 bg-[#F5C518] text-[#1A1A1A] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide">BIB GOURMAND</div>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold group-hover:text-[#C8102E] transition-colors leading-tight">{r.name}</h3>
          <span className="text-xs font-semibold text-[#6B6B6B] whitespace-nowrap">{r.priceRange}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B] mt-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{r.neighborhood || r.city}</span>
          <span>·</span>
          <span>{r.cuisine}</span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#F5C518] text-[#F5C518]" />
            <span className="text-sm font-semibold">{r.rating}</span>
            <span className="text-xs text-[#6B6B6B]">({r.reviews} avis experts)</span>
          </div>
          {r.tags?.slice(0,1).map(t => (
            <span key={t} className="text-xs bg-[#FFE8ED] text-[#C8102E] px-2.5 py-1 rounded-full font-medium">{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
