import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart, wishlist } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Collections", path: "/shop?category=collections" },
    { name: "Accessories", path: "/shop?category=accessories" },
    { name: "Custom Designs", path: "/custom-design" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? "bg-luxury-black/90 py-4 shadow-2xl backdrop-blur-md border-b border-white/5" : "bg-transparent py-8"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-luxury-gold">
          {settings?.logo ? (
            <img src={settings.logo} alt={settings.siteName} className="h-10 md:h-16 object-contain" />
          ) : (
            <>{settings?.brandTitle || "PREXIOUS"} <span className="text-white font-light">{settings?.tagline || "VOUGE"}</span></>
          )}
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors font-medium">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="hover:text-luxury-gold transition-colors">
            <Search size={20} />
          </button>
          
          <Link to="/cart" className="relative group">
            <ShoppingCart size={20} className="group-hover:text-luxury-gold transition-colors" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          <Link to="/wishlist" className="hidden md:block relative group">
            <Heart size={20} className="group-hover:text-luxury-gold transition-colors" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 hover:text-luxury-gold transition-colors underline-offset-4 decoration-luxury-gold hover:underline">
                <User size={20} />
                <span className="hidden md:block text-xs uppercase tracking-tighter font-semibold">{user.name.split(" ")[0]}</span>
              </button>
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-luxury-black border border-white/10 hidden group-hover:block transition-all"
                >
                  {user.role === "admin" && (
                    <Link to="/admin" className="block px-4 py-3 text-xs uppercase tracking-widest hover:bg-white/5">Dashboard</Link>
                  )}
                  <button onClick={logout} className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-white/5 border-t border-white/5 text-red-500">Logout</button>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hover:text-luxury-gold transition-colors">
              <User size={20} />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden hover:text-luxury-gold transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-luxury-black border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-8 flex flex-col space-y-6 text-center">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-sm uppercase tracking-[0.2em] hover:text-luxury-gold transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
