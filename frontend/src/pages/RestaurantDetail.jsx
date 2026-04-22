import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { restaurants as mockRestaurants } from "../mock";
import { Star, MapPin, Clock, Phone, Globe, Bookmark, Share2, ArrowLeft, Calendar, Users, ChevronRight } from "lucide-react";
import RestaurantCard from "../components/RestaurantCard";
import { fetchRestaurantBySlug, fetchRestaurants } from "../api/restaurants";

const StarRow = ({ count }) => (
  <div className="flex gap-1">
    {[...Array(count)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" className="w-5 h-5 fill-[#C8102E]">
        <path d="M12 2l2.39 7.36H22l-6.18 4.49L18.21 22 12 17.51 5.79 22l2.39-8.15L2 9.36h7.61L12 2z"/>
      </svg>
    ))}
  </div>
);

const RestaurantDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [r, setR] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const doc = await fetchRestaurantBySlug(slug);
        if (!cancelled && doc) {
          setR(doc);
          try {
            const all = await fetchRestaurants({ city: doc.city });
            if (!cancelled && Array.isArray(all)) {
              setSimilar(all.filter((x) => x.slug !== doc.slug).slice(0, 3));
            }
          } catch (e) {
            // fallback similar
            setSimilar(mockRestaurants.filter((x) => x.slug !== doc.slug && x.city === doc.city).slice(0, 3));
          }
        } else if (!cancelled) {
          const local = mockRestaurants.find((x) => x.slug === slug) || null;
          setR(local);
          if (local) setSimilar(mockRestaurants.filter((x) => x.slug !== local.slug && x.city === local.city).slice(0, 3));
        }
      } catch (e) {
        if (!cancelled) {
          const local = mockRestaurants.find((x) => x.slug === slug) || null;
          setR(local);
          if (local) setSimilar(mockRestaurants.filter((x) => x.slug !== local.slug && x.city === local.city).slice(0, 3));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <div className="pt-[140px] px-6 text-center">Chargement…</div>;
  if (!r) return <div className="pt-[140px] px-6 text-center">Restaurant non trouvé</div>;

  return (
    <div className="pt-[104px]">
      {/* Hero gallery */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold mb-6 hover:text-[#C8102E] transition-colors">
          <ArrowLeft className="w-4 h-4"/> Retour
        </button>
        <div className="grid lg:grid-cols-3 gap-3 h-[70vh] max-h-[600px] rounded-3xl overflow-hidden">
          <div className="lg:col-span-2 relative overflow-hidden">
            <img src={r.gallery[activeImg] || r.image} alt={r.name} className="w-full h-full object-cover" />
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-3">
            {r.gallery.slice(1,3).map((img, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl">
                <img src={img} alt="" className="w-full h-full object-cover"/>
              </div>
            ))}
            {r.gallery.length < 3 && (
              <div className="relative overflow-hidden rounded-2xl bg-[#EAE6DF]">
                <img src={r.image} alt="" className="w-full h-full object-cover"/>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            {r.stars > 0 && <StarRow count={r.stars} />}
            {r.bibGourmand && <span className="bg-[#F5C518] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Bib Gourmand</span>}
            <span className="text-sm text-[#6B6B6B]">{r.priceRange} · {r.cuisine}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-none">{r.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-[#6B6B6B]">
            <span>par <strong className="text-[#1A1A1A]">{r.chef}</strong></span>
            <span>·</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/>{r.neighborhood}, {r.city}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-[#F5C518] text-[#F5C518]"/><strong>{r.rating}</strong> ({r.reviews} avis)</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {r.tags.map(t => <span key={t} className="px-3 py-1.5 bg-[#FFE8ED] text-[#C8102E] rounded-full text-sm font-medium">{t}</span>)}
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setSaved(!saved)} className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 font-semibold transition-all ${saved ? "bg-[#C8102E] text-white border-[#C8102E]" : "bg-white border-[#EAE6DF] hover:border-[#1A1A1A]"}`}>
              <Bookmark className={`w-4 h-4 ${saved ? "fill-white" : ""}`}/>{saved ? "Enregistré" : "Enregistrer"}
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-[#EAE6DF] hover:border-[#1A1A1A] font-semibold transition-colors">
              <Share2 className="w-4 h-4"/> Partager
            </button>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">La table</h2>
            <p className="text-lg leading-relaxed text-[#1A1A1A]/80">{r.description}</p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF]">
              <Clock className="w-5 h-5 text-[#C8102E] mb-3"/>
              <div className="text-xs uppercase tracking-widest text-[#6B6B6B] mb-1">Horaires</div>
              <div className="font-semibold">{r.hours}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF]">
              <MapPin className="w-5 h-5 text-[#C8102E] mb-3"/>
              <div className="text-xs uppercase tracking-widest text-[#6B6B6B] mb-1">Adresse</div>
              <div className="font-semibold">{r.address}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF]">
              <Phone className="w-5 h-5 text-[#C8102E] mb-3"/>
              <div className="text-xs uppercase tracking-widest text-[#6B6B6B] mb-1">Téléphone</div>
              <div className="font-semibold">{r.phone}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#EAE6DF]">
              <Globe className="w-5 h-5 text-[#C8102E] mb-3"/>
              <div className="text-xs uppercase tracking-widest text-[#6B6B6B] mb-1">Web</div>
              <div className="font-semibold">{r.website}</div>
            </div>
          </div>
        </div>

        {/* Booking sticky */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-white rounded-3xl border border-[#EAE6DF] p-6 shadow-lg">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-3xl font-bold">€{r.price}</div>
                <div className="text-sm text-[#6B6B6B]">menu dégustation</div>
              </div>
              <div className="text-xs bg-[#FFE8ED] text-[#C8102E] px-2 py-1 rounded-full font-bold">Dispo ce soir</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-[#EAE6DF]">
                <Calendar className="w-4 h-4 text-[#6B6B6B]"/>
                <select className="flex-1 outline-none bg-transparent text-sm font-medium">
                  <option>Ce soir</option><option>Demain</option><option>Vendredi</option><option>Samedi</option>
                </select>
              </div>
              <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-[#EAE6DF]">
                <Users className="w-4 h-4 text-[#6B6B6B]"/>
                <select className="flex-1 outline-none bg-transparent text-sm font-medium">
                  <option>2 pers.</option><option>3 pers.</option><option>4 pers.</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {["19:30","20:00","20:30","21:00"].map(t => (
                <button key={t} className="py-2 rounded-xl border border-[#EAE6DF] text-sm font-semibold hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E] transition-colors">{t}</button>
              ))}
            </div>
            <Link to={`/reservation/${r.slug}`} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
              Réserver <ChevronRight className="w-4 h-4"/>
            </Link>
            <p className="text-xs text-[#6B6B6B] text-center mt-3">Annulation gratuite jusqu'à 24h avant</p>
          </div>
        </aside>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[#EAE6DF]">
          <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">Dans le même esprit</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-10">Tu vas aussi aimer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similar.map(s => <RestaurantCard key={s.id} r={s} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default RestaurantDetail;
