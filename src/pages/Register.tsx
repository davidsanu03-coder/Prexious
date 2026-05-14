import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import axios from "axios";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/register", { name, email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-20 px-4 min-h-screen flex items-center justify-center bg-luxury-black relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-luxury-gold opacity-5 skew-x-12 -translate-x-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 p-10 md:p-14 relative z-10"
      >
        <div className="text-center mb-12">
          <span className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">The Experience</span>
          <h1 className="text-4xl font-serif uppercase">Create Account</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 mb-8 text-red-500 text-xs text-center uppercase tracking-widest font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold mb-3 block text-gray-500">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold mb-3 block text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                placeholder="luxury@prexiousvouge.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold mb-3 block text-gray-500">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <p className="text-[10px] text-gray-500 leading-relaxed font-light italic">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <button 
            type="submit" 
            disabled={loading}
            className="luxury-button w-full h-16 space-x-3 text-sm disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-luxury-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>JOIN THE ELITE</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            Already have an account? {" "}
            <Link to="/login" className="text-luxury-gold hover:text-white transition-colors">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
