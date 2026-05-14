import { motion } from "motion/react";

export default function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1539109132382-381bb3f1cffb?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594932224444-6603f6262974?q=80&w=1780&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1886&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1780&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550630982-82030bd15311?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop",
  ];

  return (
    <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold block mb-4">Visual Heritage</span>
        <h1 className="text-5xl md:text-8xl font-serif">THE GALLERY</h1>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {images.map((img, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative group overflow-hidden"
          >
            <img src={img} alt="" className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-luxury-gold/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-luxury-black font-bold uppercase tracking-[0.3em] text-[10px] bg-white px-4 py-2">Prexious Vouge</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
