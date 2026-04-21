import React from "react";
import { Link } from "react-router-dom";
import { hotels } from "../mock";
import { MapPin, Star, Bookmark, ArrowRight } from "lucide-react";

const KeyIcon = ({ count }) => (
  <div className="flex gap-0.5">
    {[...Array(count)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 fill-[#C8102E]">
        <path d="M12.65 10C11.7 7.17 9.07 5 6 5c-3.87 0-7 3.13-7 7s3.13 7 7 7c3.07 0 5.7-2.17 6.65-5H17v3h4v-3h2v-4H12.65zM6 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
      </svg>
    ))}
  </div>
);

const Hotels = () => {
  return (
    <div className="pt-[104px] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">Clés Michelin</div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9]">
                Dormir,<br/>mais <em className="text-gradient-red">bien</em>.
              </h1>
              <p className="text-[#6B6B6B] mt-6 text-lg max-w-lg">
                Des palaces aux boutiques hôtels, une sélection d'adresses où le design, l'expérience et le service racontent quelque chose.
              </p>
              <div className="flex gap-3 mt-8">
                <button className="btn-primary">Explorer</button>
                <button className="btn-ghost">Destinations</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {hotels.slice(0,2).map((h, i) => (
                <div key={h.id} className={`relative rounded-3xl overflow-hidden ${i === 0 ? "aspect-[3/4]" : "aspect-[3/4] mt-12"}`}>
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                  <div className="absolute bottom-4 left-4 text-white">
                    <KeyIcon count={h.keys}/>
                    <div className="font-bold mt-1">{h.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          {["Tous","Palaces","Boutique","Design","Campagne","Côte d'Azur","Montagne"].map((f,i) => (
            <button key={f} className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${i===0 ? "bg-[#1A1A1A] text-[#FFF8F0] border-[#1A1A1A]" : "bg-white border-[#EAE6DF] hover:border-[#1A1A1A]"}`}>{f}</button>
          ))}
        </div>
      </section>

      {/* List */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        {hotels.map(h => (
          <Link to="#" key={h.id} className="group">
            <div className="relative overflow-hidden rounded-3xl aspect-[4/3] mb-5">
              <img src={h.image} alt={h.name} className="w-full h-full object-cover img-zoom"/>
              <button onClick={(e)=>e.preventDefault()} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                <Bookmark className="w-4 h-4"/>
              </button>
              <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full"><KeyIcon count={h.keys}/></div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold group-hover:text-[#C8102E] transition-colors">{h.name}</h3>
                <div className="flex items-center gap-2 text-sm text-[#6B6B6B] mt-1">
                  <MapPin className="w-4 h-4"/>{h.city}, {h.country}
                  <span>·</span>
                  <span>{h.style}</span>
                </div>
                <p className="text-[#6B6B6B] mt-3 text-sm">{h.description}</p>
              </div>
              <div className="text-right whitespace-nowrap">
                <div className="text-xs text-[#6B6B6B]">à partir de</div>
                <div className="text-2xl font-bold">€{h.priceFrom}</div>
                <div className="text-xs text-[#6B6B6B]">/nuit</div>
                <div className="flex items-center gap-1 mt-2 justify-end">
                  <Star className="w-4 h-4 fill-[#F5C518] text-[#F5C518]"/>
                  <span className="text-sm font-semibold">{h.rating}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[#1A1A1A] text-white rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold">Packages Dine & Stay</h2>
            <p className="text-white/70 mt-3 max-w-md">Réserve un menu dégustation et une chambre dans le même palace. Économise jusqu'à 30%.</p>
          </div>
          <button className="bg-[#F5C518] text-[#1A1A1A] font-bold px-8 py-4 rounded-full hover:bg-white transition-colors inline-flex items-center gap-2">
            Découvrir <ArrowRight className="w-5 h-5"/>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hotels;
