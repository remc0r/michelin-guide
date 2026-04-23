import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Menu, X, MapPin, Heart, User, LogOut } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Check for user authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const links = [
    { to: "/restaurants", label: "Restaurants" },
    { to: "/hotels", label: "Hôtels" },
    { to: "/magazine", label: "Magazine" },
    { to: "/feed", label: "Activité" },
    { to: "/friends", label: "Amis" }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm" : "bg-transparent"}`}>
      {/* Michelin Guide top ribbon */}
      {!scrolled && (
        <div className="bg-[#C91818] text-white text-xs py-2 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
            <span className="font-medium tracking-wide">MICHELIN GUIDE</span>
            <span className="opacity-60">·</span>
            <span className="opacity-90">Découvrez les meilleurs restaurants et hôtels du monde</span>
          </div>
        </div>
      )}

      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-[#C91818] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-xl tracking-tight text-black">MICHELIN</span>
            <span className="text-[10px] tracking-[0.2em] text-gray-600 mt-0.5">GUIDE</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({isActive}) => `nav-link text-sm font-medium tracking-wide transition-colors ${isActive ? "text-[#C91818]" : "text-black hover:text-[#C91818]"}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:border-black transition-colors text-sm font-medium">
            <MapPin className="w-4 h-4" />
            <span>Paris</span>
          </button>
          <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors" aria-label="Rechercher">
            <Search className="w-5 h-5 text-black" />
          </button>
          <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Favoris">
            <Heart className="w-5 h-5 text-black" />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-[#C91818] flex items-center justify-center text-white font-bold">
                  {user.profile?.firstName?.[0] || user.username?.[0] || 'U'}
                </div>
                <span className="hidden md:block">{user.profile?.firstName || user.username}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Mon profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block px-6 py-2 rounded-full bg-[#C91818] text-white text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Connexion
            </Link>
          )}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
          </button>
        </div>
      </nav>

      {/* Mobile */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-3">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} className="text-lg font-medium py-2 text-black hover:text-[#C91818]">{l.label}</NavLink>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="mt-2 text-left py-2 text-red-600 font-medium"
              >
                Déconnexion
              </button>
            ) : (
              <Link to="/login" className="mt-2 px-6 py-2 rounded-full bg-[#C91818] text-white text-sm font-medium hover:bg-red-700 transition-colors w-fit">
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
