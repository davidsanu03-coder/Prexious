import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/testimonials").then(res => setReviews(res.data));
  }, []);

  const displayReviews = reviews.length > 0 ? reviews : [
    { name: "Anita George", date: "Oct 2026", content: "The bespoke wedding gown I received was beyond my wildest dreams.", rating: 5, avatar: "AG" },
    { name: "David Alaba", date: "Sep 2026", content: "Truly world-class service. Their suits are on par with any high-end brand.", rating: 5, avatar: "DA" },
  ];

  return (
    <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold block mb-4">Elite Voices</span>
        <h1 className="text-5xl md:text-8xl font-serif italic uppercase">THE TESTIMONIALS</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayReviews.map((rev, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 border border-white/5 p-12 relative group hover:bg-white/10 transition-all duration-500"
          >
            <Quote className="text-luxury-gold opacity-10 absolute top-8 right-8" size={64} />
            
            <div className="flex items-center space-x-2 text-luxury-gold mb-8">
              {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>

            <p className="text-xl md:text-2xl font-serif tracking-wide leading-relaxed italic mb-10 text-gray-200 lowercase first-letter:uppercase">
              "{rev.content || rev.text}"
            </p>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center font-bold text-luxury-black text-sm uppercase overflow-hidden">
                {rev.image ? <img src={rev.image} className="w-full h-full object-cover" /> : rev.avatar || rev.name[0]}
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold tracking-widest">{rev.name}</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">{rev.role || rev.date || "Distinguished Client"}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 text-center bg-luxury-gold/5 border border-luxury-gold/10 p-20">
        <h3 className="text-3xl font-serif mb-8 italic">Share your experience with us.</h3>
        <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-bold mb-12">We value the feedback of our distinguished clientele.</p>
        <button className="luxury-button">SUBMIT A REVIEW</button>
      </div>
    </div>
  );
}
