import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Twitter, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-[#F8F9FA] mt-24">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-bold leading-tight text-white">Découvrez les meilleures tables du monde.</h3>
            <p className="text-white/70 mt-4 text-base max-w-lg">Rejoignez notre communauté de passionnés et partagez vos expériences culinaires avec vos amis.</p>
          </div>
          <div className="flex gap-2 items-center bg-white/5 border border-white/15 rounded-full p-2 pl-6 hover:border-[#C91818] transition-colors">
            <input type="email" placeholder="votre@email.com" className="flex-1 bg-transparent outline-none text-white placeholder-white/40" />
            <button className="bg-[#C91818] text-white rounded-full px-6 py-3 font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-colors">
              S'inscrire <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#C91818] flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <div className="font-bold text-xl text-white">MICHELIN</div>
              <div className="text-[10px] tracking-[0.2em] text-white/60">GUIDE</div>
            </div>
          </div>
          <p className="mt-4 text-white/60 max-w-sm text-sm leading-relaxed">Le guide gastronomique mondial depuis 1900. Découvrez les étoilés, Bib Gourmand et établissements recommandés dans le monde entier.</p>
          <div className="flex gap-3 mt-6">
            {[Instagram, Youtube, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#C91818] hover:border-[#C91818] transition-colors">
                <Icon className="w-4 h-4 text-white" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Explorer", links: [["Restaurants","/restaurants"],["Hôtels","/hotels"],["Magazine","/magazine"],["Palmarès","/"]] },
          { title: "Communauté", links: [["Mon activité","/feed"],["Mes amis","/friends"],["Mes réservations","/profile"],["Profil","/profile"]] },
          { title: "Légal", links: [["Mentions légales","/"],["Confidentialité","/"],["Cookies","/"],["CGU","/"]] }
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-bold text-sm tracking-wider uppercase text-white/50 mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map(([label, to]) => (
                <li key={label}><Link to={to} className="text-white/70 hover:text-[#C91818] text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <span>© 2026 MICHELIN GUIDE. Tous droits réservés.</span>
          <span>Partagez vos expériences culinaires avec vos amis.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
