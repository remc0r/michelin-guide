import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Twitter, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-[#FFF8F0] mt-24">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-bold leading-tight">La newsletter qui ne te fait pas culpabiliser.</h3>
            <p className="text-white/60 mt-4 text-base max-w-lg">Chaque vendredi à midi, 3 adresses, 1 portrait, 0 blabla. Zero spam, promis.</p>
          </div>
          <div className="flex gap-2 items-center bg-white/5 border border-white/15 rounded-full p-2 pl-6 hover:border-[#F5C518] transition-colors">
            <input type="email" placeholder="ton@email.com" className="flex-1 bg-transparent outline-none text-[#FFF8F0] placeholder-white/40" />
            <button className="bg-[#F5C518] text-[#1A1A1A] rounded-full px-6 py-3 font-bold flex items-center gap-2 hover:bg-white transition-colors">
              S'inscrire <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center">
              <span className="display-font text-xl font-bold">F</span>
            </div>
            <div>
              <div className="display-font font-bold text-xl">FORK</div>
              <div className="text-[9px] tracking-[0.3em] text-white/50">GUIDE GASTRONOMIQUE</div>
            </div>
          </div>
          <p className="mt-4 text-white/60 max-w-sm text-sm leading-relaxed">Le guide gastronomique pour celles et ceux qui pensent qu'un bon repas raconte une histoire. Depuis 2025.</p>
          <div className="flex gap-3 mt-6">
            {[Instagram, Youtube, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#C8102E] hover:border-[#C8102E] transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Découvrir", links: [["Restaurants","/restaurants"],["Hôtels","/hotels"],["Magazine","/magazine"],["Palmarès 2025","/"]] },
          { title: "Guié", links: [["À propos","/"],["Les inspecteurs","/"],["Pour les chefs","/"],["Presse","/"]] },
          { title: "Légal", links: [["Mentions légales","/"],["Confidentialité","/"],["Cookies","/"],["CGU","/"]] }
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-bold text-sm tracking-wider uppercase text-white/40 mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map(([label, to]) => (
                <li key={label}><Link to={to} className="text-white/80 hover:text-[#F5C518] text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <span>© 2025 FORK. Tous droits réservés.</span>
          <span>Fait avec amour à Paris. Served hot.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
