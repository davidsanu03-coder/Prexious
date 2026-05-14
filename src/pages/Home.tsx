import { motion } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export default function Home() {
  const { settings } = useSettings();

  return (
    <div className="bg-luxury-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={settings?.heroImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"} 
            alt="Luxury Fashion" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-luxury-gold uppercase tracking-[0.5em] text-[10px] md:text-sm font-bold mb-6 block"
          >
            {settings?.tagline || "Luxury Fashion Heritage"}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-serif font-bold mb-8 leading-tight tracking-tight uppercase"
          >
            {settings?.heroTitle ? <div dangerouslySetInnerHTML={{ __html: settings.heroTitle.replace(/\n/g, "<br />") }} /> : "THE PINNACLE OF HIGH-END FASHION"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto mb-12 font-light tracking-wide leading-relaxed"
          >
            {settings?.heroSubtitle || "Discover the exclusive collection where tradition meets modernity. Bespoke tailoring and ready-to-wear luxury for the discerning few."}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link to="/shop" className="luxury-button min-w-[200px]">
              SHOP COLLECTION
            </Link>
            <Link to="/custom-design" className="luxury-button-outline min-w-[200px]">
              BOOK CUSTOM DESIGN
            </Link>
            <a 
              href={`https://wa.me/${settings?.whatsappNumber || "2347045001991"}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold hover:text-luxury-gold transition-colors"
            >
              <MessageCircle size={18} />
              <span>MESSAGE ON WHATSAPP</span>
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-[10px] uppercase tracking-widest font-medium text-gray-500 mb-2">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-luxury-gold to-transparent" />
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold block mb-4">Categories</span>
            <h2 className="text-4xl md:text-6xl font-serif">OUR COLLECTIONS</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center space-x-2 text-xs uppercase tracking-widest font-bold group">
            <span>View All</span>
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Men's Wears", img: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1780&auto=format&fit=crop", span: "md:col-span-1" },
            { name: "Women's Wears", img: "https://images.unsplash.com/photo-1539109132382-381bb3f1cffb?q=80&w=1887&auto=format&fit=crop", span: "md:col-span-1" },
            { name: "Native Wears", img: "https://images.unsplash.com/photo-1582201943021-e8e5b31ed60e?q=80&w=1886&auto=format&fit=crop", span: "md:col-span-2" },
            { name: "Corporate Wears", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop", span: "md:col-span-2" },
            { name: "Wedding Outfits", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop", span: "md:col-span-1" },
            { name: "Street Fashion", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop", span: "md:col-span-1" },
          ].map((cat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className={`relative h-[400px] overflow-hidden group cursor-pointer ${cat.span}`}
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-2xl font-serif mb-4">{cat.name}</h3>
                <Link to={`/shop?category=${cat.name}`} className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                  <span>Explore Collection</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="bg-luxury-beige py-32 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative z-10 w-full aspect-[4/5] overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1888&auto=format&fit=crop" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute -bottom-10 -right-10 hidden md:block w-72 h-96 bg-luxury-black z-0" />
          </div>

          <div className="text-luxury-black">
            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold block mb-6">Our Legacy</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-12 leading-tight">MASTERING THE ART OF <span className="italic">TAILORING</span></h2>
            <div className="space-y-8 text-gray-700 leading-relaxed font-light">
              <p>At Prexious Vouge, we believe that fashion is not just what you wear, but how you present your essence to the world. Each garment is a masterpiece, crafted with meticulous attention to detail and a passion for perfection.</p>
              <p>Founded on the principles of luxury, creativity, and elegance, we have redefined the standards of high-end fashion design. From the selection of the finest fabrics to the final stitch, our journey is one of unwavering commitment to excellence.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-luxury-gold/20">
              <div>
                <h4 className="text-4xl font-serif font-bold text-luxury-gold mb-2">500+</h4>
                <p className="text-[10px] uppercase tracking-widest font-bold">Designs</p>
              </div>
              <div>
                <h4 className="text-4xl font-serif font-bold text-luxury-gold mb-2">10k+</h4>
                <p className="text-[10px] uppercase tracking-widest font-bold">Clients</p>
              </div>
              <div>
                <h4 className="text-4xl font-serif font-bold text-luxury-gold mb-2">12+</h4>
                <p className="text-[10px] uppercase tracking-widest font-bold">Years</p>
              </div>
            </div>

            <Link to="/about" className="luxury-button mt-16 text-white bg-luxury-black">
              DISCOVER MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Accessories Showcase */}
      <section className="py-32 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold block mb-4">Premium</span>
            <h2 className="text-4xl md:text-6xl font-serif">LUXURY ACCESSORIES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Timepieces", price: "From $1,200", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop" },
              { name: "Leather Goods", price: "From $850", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop" },
              { name: "Designer Jewelry", price: "From $450", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden mb-8">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" />
                  <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="text-xl font-serif mb-2">{item.name}</h3>
                <p className="text-luxury-gold text-sm font-bold uppercase tracking-widest mb-6">{item.price}</p>
                <Link to="/shop?category=accessories" className="text-[10px] uppercase tracking-widest font-bold border-b border-white/20 pb-2 hover:border-luxury-gold transition-colors">
                  Shop Collection
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience CTA */}
      <section className="relative py-40 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 fixed" 
          alt="CTA Background"
        />
        <div className="absolute inset-0 bg-luxury-black/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-7xl font-serif mb-12 italic">Experience true bespoke luxury.</h2>
          <p className="text-gray-400 text-lg mb-16 font-light tracking-wide">Whether it's a red carpet event or a custom wedding ensemble, we bring your vision to life with unparalleled artisanry.</p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link to="/custom-design" className="luxury-button">BOOK APPOINTMENT</Link>
            <Link to="/contact" className="luxury-button-outline">VISIT OUR STUDIO</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
