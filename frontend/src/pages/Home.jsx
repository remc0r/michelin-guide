import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Flame, Users, Sparkles, Crown, Utensils, Coffee, TrendingUp, ChevronRight } from "lucide-react";
import { restaurants, articles, cities, moods } from "../mock";
import RestaurantCard from "../components/RestaurantCard";

const moodIcons = { flame: Flame, users: Users, sparkles: Sparkles, crown: Crown, utensils: Utensils, coffee: Coffee };

const Home = () => {
  const featured = restaurants.slice(0, 4);
  const newEntries = restaurants.slice(2, 6);
  const topArticles = articles.slice(0, 3);

  return (
    <div className="pt-[104px]">
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-[#FFE8ED] text-[#C8102E] px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase mb-8">
                <span className="live-dot" /> Édition Palmarès 2025
              </div>
              <h1 className="text-[56px] md:text-[80px] lg:text-[100px] leading-[0.92] font-bold tracking-tight">
                Mange<br/>
                <span className="text-gradient-red italic">comme tu</span><br/>
                vis.
              </h1>
              <p className="text-lg md:text-xl text-[#6B6B6B] mt-8 max-w-xl leading-relaxed">
                Le guide gastronomique réinventé pour celles et ceux qui préfèrent le grébaut au guérard. 3-étoiles, bib gourmand, bistrots cult— toute la scène, curatée sans snobisme.
              </p>
              <div className="flex flex-wrap gap-3 mt-10">
                <Link to="/restaurants" className="btn-primary inline-flex items-center gap-2">Explorer les restaurants <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/magazine" className="btn-ghost inline-flex items-center gap-2">Lire le magazine</Link>
              </div>

              {/* stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-[#EAE6DF] max-w-xl">
                <div>
                  <div className="text-4xl font-bold text-[#C8102E]">628</div>
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wider mt-1">Restaurants</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#C8102E]">24</div>
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wider mt-1">3-étoiles</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#C8102E]">47</div>
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wider mt-1">Villes</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img src={restaurants[0].image} alt="Featured" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xs tracking-widest uppercase bg-[#C8102E] inline-block px-2 py-1 rounded mb-3">Pick de la semaine</div>
                  <h3 className="text-3xl font-bold">{restaurants[0].name}</h3>
                  <p className="text-sm opacity-90">{restaurants[0].chef} · {restaurants[0].city}</p>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-[#F5C518] flex flex-col items-center justify-center text-[#1A1A1A] font-bold text-center float-anim shadow-xl">
                <div className="text-[10px] tracking-widest">NEW</div>
                <div className="text-3xl display-font">3★</div>
                <div className="text-[10px] tracking-widest">2025</div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-16 bg-white rounded-full shadow-lg border border-[#EAE6DF] p-2 flex flex-wrap md:flex-nowrap items-center gap-2 max-w-4xl">
            <div className="flex-1 flex items-center gap-3 px-5 py-3 min-w-[200px]">
              <Search className="w-5 h-5 text-[#6B6B6B]" />
              <input placeholder="Chercher un resto, un chef, une ville..." className="flex-1 outline-none bg-transparent text-sm" />
            </div>
            <div className="hidden md:block w-px h-8 bg-[#EAE6DF]" />
            <select className="px-5 py-3 bg-transparent outline-none text-sm font-medium cursor-pointer">
              <option>Toutes les villes</option>
              <option>Paris</option><option>Lyon</option><option>Marseille</option>
            </select>
            <button className="btn-primary flex items-center gap-2"><Search className="w-4 h-4"/>Trouver</button>
          </div>
        </div>

        {/* marquee */}
        <div className="bg-[#1A1A1A] py-6 overflow-hidden">
          <div className="flex gap-12 marquee-track whitespace-nowrap">
            {[...Array(2)].map((_, r) => (
              <div key={r} className="flex gap-12 items-center">
                {["Parisien ou provincial", "•", "3 étoiles ou troquet", "•", "Foodie ou amateur", "•", "Solo ou entre potes", "•", "Menu dégustation ou formule midi", "•"].map((t, i) => (
                  <span key={`${r}-${i}`} className="text-[#FFF8F0] display-font text-3xl md:text-5xl font-bold opacity-80">{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOODS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">Choisis ton vibe</div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">C'est quoi l'humeur<br/>ce soir ?</h2>
          </div>
          <Link to="/restaurants" className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-[#C8102E] transition-colors">Tout voir <ArrowRight className="w-4 h-4"/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {moods.map(m => {
            const Ic = moodIcons[m.emoji];
            return (
              <Link key={m.id} to="/restaurants" className="group p-6 rounded-2xl border-2 border-[#EAE6DF] hover:border-[#C8102E] bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: m.color + "20", color: m.color }}>
                  <Ic className="w-5 h-5" />
                </div>
                <div className="font-bold text-base group-hover:text-[#C8102E] transition-colors">{m.label}</div>
                <ArrowRight className="w-4 h-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-white py-24 border-y border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">Incontournables</div>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">Les <em className="text-gradient-red">Cover Stars</em></h2>
              <p className="text-[#6B6B6B] mt-4 max-w-xl">Quatre tables qui définissent l'époque. Pas les plus chères — les plus pertinentes.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map(r => <RestaurantCard key={r.id} r={r} variant="editorial" />)}
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">Par ville</div>
            <h2 className="text-4xl md:text-6xl font-bold">D'où tu viens ?</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cities.map(c => (
            <Link to="/restaurants" key={c.name} className="group relative aspect-square rounded-2xl overflow-hidden">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover img-zoom" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xl font-bold">{c.name}</div>
                <div className="text-xs opacity-80">{c.count} adresses</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="bg-[#1A1A1A] text-[#FFF8F0] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-[#F5C518] font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Trending cette semaine
              </div>
              <h2 className="text-4xl md:text-6xl font-bold">Ce dont tout Paris parle.</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <Link to={`/restaurants/${newEntries[0].slug}`} className="group relative aspect-[4/3] rounded-3xl overflow-hidden">
              <img src={newEntries[0].image} alt={newEntries[0].name} className="w-full h-full object-cover img-zoom" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="text-xs tracking-widest text-[#F5C518] font-bold mb-2">#1 TRENDING</div>
                <h3 className="text-4xl font-bold">{newEntries[0].name}</h3>
                <p className="text-white/70 mt-2">{newEntries[0].description.slice(0, 100)}...</p>
              </div>
            </Link>
            <div className="space-y-4">
              {newEntries.slice(1,4).map((r, i) => (
                <Link to={`/restaurants/${r.slug}`} key={r.id} className="flex gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                  <div className="text-5xl font-bold text-[#F5C518] display-font w-12">#{i+2}</div>
                  <img src={r.image} alt={r.name} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold group-hover:text-[#F5C518] transition-colors">{r.name}</h4>
                    <div className="text-sm text-white/60 mt-1">{r.chef} · {r.city}</div>
                    <div className="flex gap-2 mt-2">
                      {r.tags.slice(0,2).map(t => <span key={t} className="text-[10px] bg-white/10 px-2 py-1 rounded-full">{t}</span>)}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#F5C518] self-center transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAGAZINE */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">Magazine</div>
            <h2 className="text-4xl md:text-6xl font-bold">À lire avec le café.</h2>
          </div>
          <Link to="/magazine" className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-[#C8102E] transition-colors">Tous les articles <ArrowRight className="w-4 h-4"/></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {topArticles.map((a, i) => (
            <Link to={`/magazine/${a.slug}`} key={a.id} className="group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover img-zoom" />
                <div className="absolute top-4 left-4 bg-[#FFF8F0] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{a.category}</div>
              </div>
              <div className="text-xs text-[#6B6B6B] tracking-wider uppercase mb-2">{a.date} · {a.readTime}</div>
              <h3 className="text-2xl font-bold leading-tight group-hover:text-[#C8102E] transition-colors">{a.title}</h3>
              <p className="text-[#6B6B6B] mt-2 text-sm">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* BIG CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-[#C8102E] text-white p-12 md:p-20">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#F5C518]/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight">Ta prochaine<br/><em>obsession</em> ?</h2>
              <p className="text-white/80 mt-6 text-lg max-w-md">Crée ton compte, sauvegarde tes spots, reçois des drops exclusifs sur les ouvertures.</p>
            </div>
            <div className="flex md:justify-end">
              <button className="bg-white text-[#C8102E] font-bold text-lg px-8 py-4 rounded-full hover:bg-[#F5C518] hover:text-[#1A1A1A] transition-colors inline-flex items-center gap-2">
                Créer mon compte <ArrowRight className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
