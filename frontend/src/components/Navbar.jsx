import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Menu, X, MapPin, Heart } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const links = [
    { to: "/feed", label: "Feed" },
    { to: "/restaurants", label: "Restaurants" },
    { to: "/hotels", label: "Hôtels" },
    { to: "/magazine", label: "Magazine" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#EAE6DF] shadow-sm" : "bg-transparent"}`}>
      {/* Top live ribbon */}
      {!scrolled && (
        <div className="bg-[#1A1A1A] text-[#FFF8F0] text-xs py-2 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
            <span className="live-dot" />
            <span className="font-medium tracking-wide">PALMARÈS 2025</span>
            <span className="opacity-60">·</span>
            <span className="opacity-80">3 nouveaux 3-étoiles · 47 Bib Gourmand · Le Palmarès en intégralité →</span>
          </div>
        </div>
      )}

      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <span className="text-[#FFF8F0] display-font text-xl font-bold">F</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="display-font font-bold text-xl tracking-tight">FORK</span>
            <span className="text-[9px] tracking-[0.3em] text-[#6B6B6B] mt-0.5">GUIDE GASTRONOMIQUE</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({isActive}) => `nav-link text-sm font-semibold tracking-wide ${isActive ? "active text-[#C8102E]" : "text-[#1A1A1A]"}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[#EAE6DF] hover:border-[#1A1A1A] transition-colors">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Paris</span>
          </button>
          <button className="p-2.5 hover:bg-[#EAE6DF] rounded-full transition-colors" aria-label="Rechercher">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 hover:bg-[#EAE6DF] rounded-full transition-colors relative" aria-label="Favoris">
            <Heart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C8102E] rounded-full" />
          </button>
          <button className="hidden md:block btn-primary text-sm">Connexion</button>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile */}
      {open && (
        <div className="md:hidden bg-[#FFF8F0] border-t border-[#EAE6DF] py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-3">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} className="text-lg font-semibold py-2">{l.label}</NavLink>
            ))}
            <button className="btn-primary mt-2 w-fit">Connexion</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
