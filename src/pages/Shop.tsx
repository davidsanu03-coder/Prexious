import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Filter, Search, ChevronDown, Heart, ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { toggleWishlist, wishlist, addToCart } = useCart();

  const categories = ["All", "Men's Wears", "Women's Wears", "Native Wears", "Corporate Wears", "Accessories", "Luxury Gowns"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category === "All" ? "/api/products" : `/api/products?category=${category}`;
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0">
        <div>
          <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold block mb-4">The Collection</span>
          <h1 className="text-5xl md:text-7xl font-serif">READY TO WEAR</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-luxury-gold transition-colors w-full md:w-64"
            />
          </div>
          <div className="relative group">
            <button className="flex items-center space-x-2 bg-white/5 border border-white/10 px-6 py-3 text-sm font-bold uppercase tracking-widest hover:border-luxury-gold transition-colors block">
              <span>{category}</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-luxury-black border border-white/10 hidden group-hover:block z-20">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-white/5"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((p) => (
            <motion.div 
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-white/5">
                <img 
                  src={p.images?.[0] || "https://images.unsplash.com/photo-1594932224444-6603f6262974?q=80&w=1780&auto=format&fit=crop"} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-luxury-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleWishlist(p._id)}
                      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${wishlist.includes(p._id) ? "bg-luxury-gold text-luxury-black" : "bg-white text-luxury-black hover:bg-luxury-gold"}`}
                    >
                      <Heart size={20} fill={wishlist.includes(p._id) ? "currentColor" : "none"} />
                    </button>
                    <Link 
                      to={`/product/${p._id}`}
                      className="w-12 h-12 bg-white text-luxury-black flex items-center justify-center rounded-full hover:bg-luxury-gold transition-all"
                    >
                      <Eye size={20} />
                    </Link>
                    <button 
                      onClick={() => addToCart({ id: p._id, name: p.name, price: p.price, image: p.images?.[0], quantity: 1 })}
                      className="w-12 h-12 bg-white text-luxury-black flex items-center justify-center rounded-full hover:bg-luxury-gold transition-all"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>

                {p.isFeatured && (
                  <span className="absolute top-4 left-4 bg-luxury-gold text-luxury-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                    Featured
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 block">{p.category}</span>
                <Link to={`/product/${p._id}`} className="text-sm uppercase tracking-widest font-bold hover:text-luxury-gold transition-colors block italic">
                  {p.name}
                </Link>
                <p className="text-luxury-gold font-bold">${p.price.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-white/5 bg-white/5">
          <p className="text-gray-400 uppercase tracking-widest text-sm">No products found matching your luxury search.</p>
        </div>
      )}
    </div>
  );
}
