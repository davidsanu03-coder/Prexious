import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  return (
    <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold block mb-4">Inquiries</span>
        <h1 className="text-5xl md:text-8xl font-serif">GET IN TOUCH</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Info */}
        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Mail className="text-luxury-gold" size={24} />
              <h4 className="text-[10px] uppercase tracking-widest font-bold">Email Us</h4>
              <p className="text-sm font-serif italic text-gray-400">concierge@prexiousvouge.com</p>
              <p className="text-sm font-serif italic text-gray-400">info@prexiousvouge.com</p>
            </div>
            <div className="space-y-4">
              <Phone className="text-luxury-gold" size={24} />
              <h4 className="text-[10px] uppercase tracking-widest font-bold">Call Us</h4>
              <p className="text-sm font-serif italic text-gray-400">+234 704 500 1991</p>
              <p className="text-sm font-serif italic text-gray-400">+234 810 000 0000</p>
            </div>
            <div className="space-y-4">
              <MapPin className="text-luxury-gold" size={24} />
              <h4 className="text-[10px] uppercase tracking-widest font-bold">Headquarters</h4>
              <p className="text-sm font-serif italic text-gray-400">Luxury Estate, Victoria Island<br />Lagos, Nigeria</p>
            </div>
            <div className="space-y-4">
              <Clock className="text-luxury-gold" size={24} />
              <h4 className="text-[10px] uppercase tracking-widest font-bold">Atelier Hours</h4>
              <p className="text-sm font-serif italic text-gray-400">Mon - Fri: 9am - 7pm</p>
              <p className="text-sm font-serif italic text-gray-400">Sat: 10am - 4pm (Appointment Only)</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 space-y-8">
            <h3 className="text-xl font-serif text-luxury-gold">Official WhatsApp Support</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">
              For immediate styling advice or order tracking, chat directly with our luxury concierge on WhatsApp.
            </p>
            <a 
              href="https://wa.me/2347045001991" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-4 text-xs font-bold uppercase tracking-widest border border-luxury-gold p-4 hover:bg-luxury-gold hover:text-luxury-black transition-all"
            >
              <MessageCircle size={20} />
              <span>START WHATSAPP CHAT</span>
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 p-10 md:p-16">
          <h2 className="text-xs uppercase font-bold tracking-[0.3em] mb-12 text-luxury-gold">Direct Message</h2>
          <form className="space-y-10">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Full Name</label>
              <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-luxury-gold transition-colors" placeholder="e.g. David Sanu" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Email Address</label>
              <input type="email" className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-luxury-gold transition-colors" placeholder="hello@luxury.com" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Subject</label>
              <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-luxury-gold transition-colors" placeholder="Partnership, Order, etc." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">Message</label>
              <textarea rows={4} className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-luxury-gold transition-colors resize-none" placeholder="Write your message here..."></textarea>
            </div>
            <button className="luxury-button w-full space-x-3 py-6">
              <span>SEND MESSAGE</span>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-32 w-full h-[500px] bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden grayscale">
         <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Map" />
         <div className="relative z-10 text-center space-y-6">
           <MapPin size={48} className="text-luxury-gold mx-auto mb-8" />
           <p className="text-sm uppercase tracking-[0.5em] font-bold">VICTORIA ISLAND, LAGOS</p>
           <button className="text-[10px] uppercase tracking-widest font-bold border-b-2 border-luxury-gold pb-2">Get Directions</button>
         </div>
      </div>
    </div>
  );
}
