import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Check, Star, MessageSquare } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get(`/api/reviews/${id}`)
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
        if (productRes.data.sizes?.length > 0) setSelectedSize(productRes.data.sizes[0]);
        if (productRes.data.colors?.length > 0) setSelectedColor(productRes.data.colors[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setSubmittingReview(true);
    try {
      await axios.post("/api/reviews", {
        product: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Review submitted and awaiting approval!");
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="pt-32 min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="pt-32 min-h-screen text-center">
      <h2 className="text-4xl font-serif mb-8">Product Not Found</h2>
      <button onClick={() => navigate("/shop")} className="luxury-button">Return to Shop</button>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : ["https://images.unsplash.com/photo-1594932224444-6603f6262974?q=80&w=1780&auto=format&fit=crop"];

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity,
      size: selectedSize,
      color: selectedColor
    });
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold mb-12 hover:text-luxury-gold transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Go Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button 
                  onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-luxury-black transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-luxury-black transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square border transition-all ${activeImage === idx ? "border-luxury-gold p-1" : "border-white/10 opacity-50 hover:opacity-100"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-10">
          <div>
            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-bold block mb-4">{product.category}</span>
            <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">{product.name}</h1>
            <p className="text-3xl font-serif text-luxury-gold">${product.price.toLocaleString()}</p>
          </div>

          <div className="h-[1px] bg-white/10" />

          <p className="text-gray-400 font-light leading-relaxed tracking-wide">
            {product.description}
          </p>

          <div className="space-y-8">
            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Select Size</h4>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[50px] px-4 py-2 text-[10px] uppercase font-bold border transition-all ${selectedSize === size ? "bg-luxury-gold border-luxury-gold text-luxury-black" : "border-white/20 hover:border-luxury-gold text-gray-400"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Select Color</h4>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-[10px] uppercase font-bold border transition-all ${selectedColor === color ? "bg-luxury-gold border-luxury-gold text-luxury-black" : "border-white/20 hover:border-luxury-gold text-gray-400"}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Quantity</h4>
              <div className="flex items-center space-x-4 bg-white/5 border border-white/10 w-fit p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:text-luxury-gold transition-colors">-</button>
                <span className="text-sm font-bold w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:text-luxury-gold transition-colors">+</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              className="luxury-button flex-grow py-5 space-x-3"
            >
              <ShoppingCart size={20} />
              <span>ADD TO CART</span>
            </button>
            <button 
              onClick={() => toggleWishlist(product._id)}
              className={`w-16 h-16 flex items-center justify-center border transition-all ${wishlist.includes(product._id) ? "border-luxury-gold text-luxury-gold" : "border-white/10 hover:border-luxury-gold text-gray-400"}`}
            >
              <Heart size={24} fill={wishlist.includes(product._id) ? "currentColor" : "none"} />
            </button>
            <button className="w-16 h-16 flex items-center justify-center border border-white/10 hover:border-luxury-gold text-gray-400 transition-all">
              <Share2 size={24} />
            </button>
          </div>

          <div className="pt-10 border-t border-white/10 grid grid-cols-2 gap-8 text-xs text-gray-500 uppercase tracking-widest">
            <div className="flex items-center space-x-3">
              <Check size={16} className="text-luxury-gold" />
              <span>Bespoke Quality</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check size={16} className="text-luxury-gold" />
              <span>Free Luxury Packaging</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check size={16} className="text-luxury-gold" />
              <span>Worldwide Shipping</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check size={16} className="text-luxury-gold" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-32 border-t border-white/10 pt-20">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 space-y-8">
            <div>
              <span className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">Elite Feedback</span>
              <h2 className="text-4xl font-serif">CLIENT REVIEWS</h2>
            </div>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              We value the distinction and style of our clientele. Every review is moderated to ensure the highest standards of our community.
            </p>
            
            <div className="bg-white/5 p-8 border border-white/5 space-y-6">
              <h3 className="text-sm font-serif italic text-luxury-gold flex items-center space-x-3">
                <MessageSquare size={18} />
                <span>Add Your Voice</span>
              </h3>
              {!user ? (
                <div className="space-y-4">
                  <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">Please login to share your experience with this creation.</p>
                  <Link to="/login" className="text-xs font-bold text-luxury-gold uppercase border-b border-luxury-gold pb-1">Login Now</Link>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-3">Rating</label>
                    <div className="flex space-x-2">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} 
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`hover:scale-110 transition-transform ${reviewForm.rating >= star ? "text-luxury-gold" : "text-gray-700"}`}
                        >
                          <Star size={16} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-3">Your Journey</label>
                    <textarea 
                      required
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows={4} 
                      className="w-full bg-transparent border border-white/10 p-4 text-xs font-light focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                      placeholder="Share how this piece complements your style..."
                    />
                  </div>
                  <button disabled={submittingReview} className="luxury-button w-full py-4 text-xs">
                    {submittingReview ? "SUBMITTING..." : "PUBLISH REVIEW"}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="flex-grow space-y-10">
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((review: any) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={review._id} 
                    className="bg-white/5 border border-white/5 p-8 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-1 text-luxury-gold">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                      </div>
                      <span className="text-[9px] text-gray-500 uppercase tracking-tighter">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-light italic leading-loose text-gray-300">"{review.comment}"</p>
                    <div className="pt-4 flex items-center space-x-3 border-t border-white/5">
                      <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-[10px] font-bold text-luxury-gold">
                        {review.user?.name?.[0] || "U"}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{review.user?.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-white/5 border border-dashed border-white/10 p-20 text-center">
                <div className="space-y-4 flex flex-col items-center">
                  <Star className="text-gray-700 opacity-20" size={48} />
                  <p className="text-xs uppercase tracking-widest text-gray-500">No approved reviews yet for this masterpiece.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
