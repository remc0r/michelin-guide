import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { articles } from "../mock";
import { ArrowLeft, Clock, Share2, Bookmark } from "lucide-react";

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const a = articles.find(x => x.slug === slug);
  if (!a) return <div className="pt-[140px] px-6 text-center">Article introuvable</div>;
  const related = articles.filter(x => x.id !== a.id).slice(0,3);

  return (
    <div className="pt-[104px]">
      <div className="max-w-3xl mx-auto px-6 pt-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold mb-8 hover:text-[#C8102E] transition-colors">
          <ArrowLeft className="w-4 h-4"/> Retour au magazine
        </button>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#C8102E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{a.category}</span>
          <span className="text-xs text-[#6B6B6B] flex items-center gap-1"><Clock className="w-3 h-3"/>{a.readTime}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.05]">{a.title}</h1>
        <p className="text-xl text-[#6B6B6B] mt-6 leading-relaxed">{a.excerpt}</p>
        <div className="flex items-center justify-between mt-8 pb-8 border-b border-[#EAE6DF]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#C8102E] text-white flex items-center justify-center font-bold">{a.author[0]}</div>
            <div>
              <div className="font-bold text-sm">{a.author}</div>
              <div className="text-xs text-[#6B6B6B]">{a.date}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-[#EAE6DF] flex items-center justify-center hover:border-[#1A1A1A] transition-colors"><Share2 className="w-4 h-4"/></button>
            <button className="w-10 h-10 rounded-full border border-[#EAE6DF] flex items-center justify-center hover:border-[#1A1A1A] transition-colors"><Bookmark className="w-4 h-4"/></button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        <div className="aspect-[16/9] rounded-3xl overflow-hidden">
          <img src={a.image} alt={a.title} className="w-full h-full object-cover"/>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 prose-lg">
        <p className="text-lg leading-relaxed mb-6 first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-[#C8102E]">
          Il y a encore dix ans, décider d'aller « au restaurant » signifiait choisir entre une brasserie de quartier et une table étoilée. Aujourd'hui, la carte est complètement redistribuée. Les 25-35 ans ne veulent ni des nappes blanches appridées, ni des faux bistrots corporate. Ils veulent une histoire, un produit, une ambiance.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          C'est dans cette brèche qu'une génération de chefs a bâti une nouvelle grammaire. Menu court, produit sourcé à deux kilomètres, vin nature, playlist curatée. Le décor ? Un mix de salle des fêtes et de galerie new-yorkaise.
        </p>
        <blockquote className="border-l-4 border-[#C8102E] pl-6 my-10 text-2xl md:text-3xl font-bold leading-snug serif italic">
          « On ne cuisine plus pour impressionner. On cuisine pour nourrir — au sens large. »
        </blockquote>
        <p className="text-lg leading-relaxed mb-6">
          Cette phrase, entendue dans la cuisine de Septime un mardi soir, pourrait résumer l'époque. Le fine dining n'est pas mort : il s'est fragmenté, démocratisé, rendu plus poreux. Un 3-étoiles peut coûter moins cher qu'un bistrot hype le weekend.
        </p>
        <h2 className="text-3xl font-bold mt-12 mb-4">Ce qui a changé concrètement</h2>
        <p className="text-lg leading-relaxed mb-6">
          Trois révolutions discrètes : la réservation en ligne systématique, la transparence sur les producteurs, et surtout la remise en question du service français traditionnel.
        </p>
      </article>

      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[#EAE6DF]">
        <div className="text-xs tracking-[0.3em] uppercase text-[#C8102E] font-bold mb-3">À lire aussi</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-10">Continue ta lecture</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {related.map(r => (
            <Link to={`/magazine/${r.slug}`} key={r.id} className="group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                <img src={r.image} alt={r.title} className="w-full h-full object-cover img-zoom"/>
              </div>
              <div className="text-xs uppercase tracking-widest text-[#C8102E] font-bold mb-2">{r.category}</div>
              <h3 className="text-xl font-bold group-hover:text-[#C8102E] transition-colors leading-tight">{r.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArticleDetail;
