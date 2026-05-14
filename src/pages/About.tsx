import { motion } from "motion/react";
import { Star, ShieldCheck, Zap, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function About() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    axios.get("/api/pages/about").then(res => setContent(res.data));
  }, []);

  return (
    <div className="bg-luxury-black text-white min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img src={content?.image || "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop"} className="absolute inset-0 w-full h-full object-cover opacity-40 fixed" alt="" />
        <div className="absolute inset-0 bg-luxury-black/60" />
        <div className="relative z-10 text-center space-y-6">
          <span className="text-luxury-gold text-xs uppercase tracking-[0.4em] font-bold">Since 2014</span>
          <h1 className="text-5xl md:text-9xl font-serif leading-tight">{content?.title || "OUR STORY"}</h1>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold">Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-serif uppercase">{content?.title || "WHERE ELEGANCE MEETS CREATIVITY"}</h2>
            <div className="text-gray-400 font-light leading-loose text-lg space-y-6">
              {content?.content ? (
                <div dangerouslySetInnerHTML={{ __html: content.content.replace(/\n/g, "<br/>") }} />
              ) : (
                <>
                  <p>Prexious Vouge was founded on the belief that fashion is the highest form of self-expression. Our journey began with a vision to bring world-class luxury tailoring to the global stage.</p>
                  <p>Every curve, every seam, and every fabric choice is calculated to enhance the natural grace of the wearer. We don't just sell clothes; we provide a transformative experience of prestige.</p>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="aspect-[3/4] overflow-hidden translate-y-12">
              <img src="https://images.unsplash.com/photo-1510132205561-1970476831d0?q=80&w=1887&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] overflow-hidden -translate-y-12">
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white/5 py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: Star, title: "Exclusivity", desc: "Limited edition collections and one-of-a-kind bespoke pieces." },
            { icon: ShieldCheck, title: "Heritage", desc: "Traditional tailoring techniques passed through generations." },
            { icon: Zap, title: "Innovation", desc: "Cutting-edge designs that push the boundaries of modern fashion." },
            { icon: Globe, title: "Global Reach", desc: "Representing high-fashion excellence on the international stage." },
          ].map((val, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-luxury-gold/10 text-luxury-gold flex items-center justify-center mx-auto rounded-full">
                <val.icon size={32} />
              </div>
              <h3 className="text-xl font-serif">{val.title}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Artisan Quote */}
      <section className="py-40 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-3xl md:text-5xl font-serif italic text-luxury-gold leading-snug mb-12">
            "Luxury is not about the price tag; it's about the feeling of wearing perfection crafted just for you."
          </p>
          <div className="w-20 h-[1px] bg-luxury-gold mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold">The Creative Director</p>
        </div>
      </section>
    </div>
  );
}
