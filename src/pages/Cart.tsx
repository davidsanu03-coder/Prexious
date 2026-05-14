import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="pt-40 pb-20 px-4 text-center min-h-screen">
      <div className="mb-12 flex justify-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
          <ShoppingBag size={48} />
        </div>
      </div>
      <h2 className="text-4xl md:text-6xl font-serif mb-8">YOUR BAG IS EMPTY</h2>
      <p className="text-gray-400 mb-12 uppercase tracking-widest text-xs">Discover our latest collections and find something extraordinary.</p>
      <Link to="/shop" className="luxury-button">START SHOPPING</Link>
    </div>
  );

  return (
    <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
        <h1 className="text-4xl md:text-7xl font-serif">SHOPPING BAG</h1>
        <p className="text-sm uppercase tracking-widest text-gray-500">{cart.length} ITEMS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-12">
          {cart.map((item, idx) => (
            <motion.div 
              key={`${item.id}-${item.size}-${item.color}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex space-x-8 pb-8 border-b border-white/5 group"
            >
              <div className="w-32 h-44 flex-shrink-0 bg-white/5 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              
              <div className="flex-grow flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg uppercase tracking-widest font-bold mb-2">{item.name}</h3>
                    <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                      className="w-8 h-8 flex items-center justify-center hover:text-luxury-gold"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                      className="w-8 h-8 flex items-center justify-center hover:text-luxury-gold"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-lg font-serif text-luxury-gold">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-40 h-fit bg-white/5 border border-white/10 p-10">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold mb-10 text-luxury-gold">Order Summary</h2>
          <div className="space-y-6 text-sm uppercase tracking-widest mb-10">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">${totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-bold">Calculated at next step</span>
            </div>
            <div className="pt-6 border-t border-white/10 flex justify-between text-xl font-serif">
              <span>Total</span>
              <span className="text-luxury-gold">${totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate("/checkout")}
            className="luxury-button w-full flex items-center justify-center space-x-3 py-5"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight size={20} />
          </button>
          
          <div className="mt-8 text-center">
            <Link to="/shop" className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors underline-offset-4 underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
