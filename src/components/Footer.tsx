import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-luxury-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-luxury-gold uppercase">
              {settings?.brandTitle || "PREXIOUS VOUGE"}
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {settings?.heroSubtitle?.substring(0, 150) || "Defining high-end fashion and luxury lifestyle since 2026. Expert craftsmanship and bespoke designs."}...
            </p>
            <div className="flex space-x-4">
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all">
                  <Instagram size={18} />
                </a>
              )}
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all">
                <Facebook size={18} />
              </a>
              <a href={`https://wa.me/${settings?.whatsappNumber || "2347045001991"}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-luxury-gold">Menu</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/shop?category=collections" className="hover:text-white transition-colors">Collections</Link></li>
              <li><Link to="/custom-design" className="hover:text-white transition-colors">Custom Designs</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-luxury-gold">Experience</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-luxury-gold">Newsletter</h4>
            <div className="space-y-6">
              <p className="text-sm text-gray-400">Subscribe for exclusive collection drops and luxury fashion insights.</p>
              <div className="flex bg-white/5 border border-white/10 p-1">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-transparent border-none text-white text-xs p-3 focus:outline-none flex-grow"
                />
                <button className="bg-luxury-gold text-luxury-black text-[10px] uppercase font-bold px-4 py-2 hover:bg-white transition-colors">Join</button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            © 2026 Prexious Vouge. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <img src="https://checkout.paystack.com/assets/img/paystack-badge.png" alt="Paystack" className="h-6 grayscale opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
}
