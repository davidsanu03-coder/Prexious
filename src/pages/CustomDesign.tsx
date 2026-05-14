import React, { useState } from "react";
import { motion } from "motion/react";
import { Upload, Calendar, MessageCircle, Ruler, Scissors, Star } from "lucide-react";
import axios from "axios";

export default function CustomDesign() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    outfitType: "Bespoke Suit",
    eventDate: "",
    description: ""
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const outfitTypes = [
    "Bespoke Suit", "Wedding Gown", "Native/Traditional", 
    "Corporate Wear", "Evening Gown", "Red Carpet Ensemble"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, String(val)));
      if (image) data.append("image", image);

      await axios.post("/api/bookings", data);
      setSuccess(true);
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="pt-40 pb-20 px-4 text-center min-h-screen">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="w-20 h-20 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center mx-auto mb-8">
          <Star size={40} />
        </div>
        <h2 className="text-4xl md:text-6xl font-serif mb-6 uppercase">Booking Received</h2>
        <p className="text-gray-400 max-w-xl mx-auto uppercase tracking-widest text-[10px] font-bold leading-loose">
          Our master artisans have received your inquiry. We will contact you shortly to schedule your first consultation.
        </p>
        <button onClick={() => setSuccess(false)} className="luxury-button mt-12">New Booking</button>
      </motion.div>
    </div>
  );

  return (
    <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* Info */}
        <div className="space-y-12">
          <div>
            <span className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">Bespoke Experience</span>
            <h1 className="text-5xl md:text-8xl font-serif italic mb-10 leading-tight">CRAFT YOUR <br /> VISION.</h1>
            <p className="text-gray-400 font-light leading-relaxed tracking-wide text-lg">
              Embark on a journey of luxury where every stitch tells your story. Our bespoke service offers an exclusive consultation with our master designers to create garments that are uniquely yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-white/5 bg-white/5 space-y-4">
              <Ruler size={32} className="text-luxury-gold" />
              <h3 className="font-serif text-xl">Perfect Fit</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">Individual measurements for absolute comfort and silhouette perfection.</p>
            </div>
            <div className="p-8 border border-white/5 bg-white/5 space-y-4">
              <Scissors size={32} className="text-luxury-gold" />
              <h3 className="font-serif text-xl">Artisan Soul</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">Meticulously handcrafted by experts with decades of high-fashion experience.</p>
            </div>
          </div>

          <div className="bg-luxury-gold p-10 text-luxury-black">
            <h4 className="text-xs uppercase font-bold tracking-[0.2em] mb-4">Direct Inquiry</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <MessageCircle size={32} />
                <span className="text-2xl font-serif font-bold tracking-tighter">0704 500 1991</span>
              </div>
              <a href="https://wa.me/2347045001991" className="text-[10px] uppercase font-bold border-b-2 border-luxury-black pb-1 hover:text-white hover:border-white transition-all">WhatsApp Now</a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 p-10 md:p-16">
          <h2 className="text-xs uppercase font-bold tracking-[0.3em] mb-12 text-luxury-gold">Consultation Request</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 p-2 text-sm focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email</label>
                <input 
                  type="email" required
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 p-2 text-sm focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Phone</label>
                <input 
                  type="tel" required
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 p-2 text-sm focus:outline-none focus:border-luxury-gold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Outfit Type</label>
                <select 
                  value={formData.outfitType} onChange={e => setFormData({...formData, outfitType: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 p-2 text-sm focus:outline-none focus:border-luxury-gold"
                >
                  {outfitTypes.map(t => <option key={t} value={t} className="bg-luxury-black">{t}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Requested Event Date</label>
              <div className="relative">
                <Calendar className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                <input 
                  type="date" required
                  value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 p-2 text-sm focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Project Description</label>
              <textarea 
                rows={4} 
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-transparent border-b border-white/20 p-2 text-sm focus:outline-none focus:border-luxury-gold resize-none"
                placeholder="Tell us about your dream design..."
              ></textarea>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Inspiration Image</h4>
              <label className="w-full aspect-video border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-luxury-gold transition-colors group">
                {image ? (
                  <span className="text-sm font-bold text-luxury-gold uppercase tracking-widest">{image.name}</span>
                ) : (
                  <>
                    <Upload className="text-gray-600 group-hover:text-luxury-gold transition-colors mb-4" size={40} />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-600">Upload Reference</span>
                  </>
                )}
                <input type="file" className="hidden" onChange={e => setImage(e.target.files?.[0] || null)} accept="image/*" />
              </label>
            </div>

            <button disabled={loading} className="luxury-button w-full h-16 text-sm uppercase tracking-widest disabled:opacity-50 mt-10">
              {loading ? "SCHEDULING..." : "REQUEST CONSULTATION"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
