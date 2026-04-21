import React, { useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "../mock";
import { ArrowRight, Clock } from "lucide-react";

const categories = ["Tout", "Décryptage", "Portrait", "Cave", "Culture", "Voyage", "Tendance"];

const Magazine = () => {
  const [cat, setCat] = useState("Tout");
  const list = cat === "Tout" ? articles : articles.filter(a => a.category === cat);
  const [hero, ...rest] = list;

  return (
    <div className="pt-[104px] min-h-screen">
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">Magazine</div>
        <h1 className="text-5xl md:text-8xl font-bold leading-[0.9]">
          L'<em className="text-gradient-red">époque</em><br/>dans l'assiette.
        </h1>
        <p className="text-[#6B6B6B] mt-5 text-lg max-w-2xl">
          Portraits, décryptages, itinéraires. L'actualité gastronomique sans ronds de jambe.
        </p>
      </section>

      {/* Cat filter */}
      <section className="max-w-7xl mx-auto px-6 mt-12 flex flex-wrap gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${cat === c ? "bg-[#C8102E] text-white border-[#C8102E]" : "bg-white border-[#EAE6DF] hover:border-[#C8102E]"}`}>
            {c}
          </button>
        ))}
      </section>

      {/* Hero article */}
      {hero && (
        <section className="max-w-7xl mx-auto px-6 mt-10">
          <Link to={`/magazine/${hero.slug}`} className="group grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <img src={hero.image} alt={hero.title} className="w-full h-full object-cover img-zoom"/>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-[#1A1A1A] text-[#FFF8F0] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">À LA UNE</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E]">{hero.category}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight mt-4 group-hover:text-[#C8102E] transition-colors">{hero.title}</h2>
              <p className="text-[#6B6B6B] mt-4 text-lg">{hero.excerpt}</p>
              <div className="flex items-center gap-4 mt-6 text-sm text-[#6B6B6B]">
                <span className="font-semibold text-[#1A1A1A]">{hero.author}</span>
                <span>·</span>
                <span>{hero.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{hero.readTime}</span>
              </div>
              <div className="inline-flex items-center gap-2 mt-6 text-[#C8102E] font-bold">Lire l'article <ArrowRight className="w-4 h-4"/></div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rest.map(a => (
            <Link to={`/magazine/${a.slug}`} key={a.id} className="group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover img-zoom"/>
                <div className="absolute top-4 left-4 bg-[#FFF8F0] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{a.category}</div>
              </div>
              <div className="text-xs text-[#6B6B6B] tracking-wider uppercase mb-2">{a.date} · {a.readTime}</div>
              <h3 className="text-2xl font-bold leading-tight group-hover:text-[#C8102E] transition-colors">{a.title}</h3>
              <p className="text-[#6B6B6B] mt-2 text-sm">{a.excerpt}</p>
              <div className="text-xs text-[#1A1A1A] mt-3 font-semibold">par {a.author}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Magazine;
