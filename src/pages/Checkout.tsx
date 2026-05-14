import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { motion } from "motion/react";
import { CreditCard, Truck, Lock, ChevronLeft } from "lucide-react";

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "Nigeria"
  });

  if (cart.length === 0) {
    navigate("/shop");
    return null;
  }

  const handlePaystackSuccess = async (reference: any) => {
    try {
      setLoading(true);
      await axios.post("/api/payment/verify", {
        reference: reference.reference,
        address,
        items: cart,
        amount: totalAmount
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      clearCart();
      navigate("/shop");
      alert("Payment successful! Your order has been placed.");
    } catch (err) {
      alert("Payment verification failed. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackClose = () => {
    alert("Payment window closed.");
  };

  const handleCheckoutClick = () => {
    if (!user) {
      alert("Please login to proceed");
      navigate("/login?redirect=checkout");
      return;
    }
    if (!address.street || !address.city || !address.state) {
      alert("Please provide shipping address");
      return;
    }

    setLoading(true);
    
    // Manual Paystack Inline implementation
    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_your_public_key",
      email: user.email,
      amount: totalAmount * 100 * 1600, // NGN conversion
      currency: "NGN",
      callback: (reference: any) => {
        handlePaystackSuccess(reference);
      },
      onClose: () => {
        handlePaystackClose();
        setLoading(false);
      }
    });
    handler.openIframe();
  };

  return (
    <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Form */}
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif mb-6">CHECKOUT</h1>
            <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Secure Luxury Transaction</p>
          </div>

          <section className="space-y-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-luxury-gold text-luxury-black flex items-center justify-center rounded-full font-bold">1</div>
              <h2 className="text-xl font-serif">Shipping Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold mb-2 block text-gray-500">Street Address</label>
                <input 
                  type="text" 
                  value={address.street}
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:outline-none focus:border-luxury-gold" 
                  placeholder="e.g. 123 Fashion Ave"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold mb-2 block text-gray-500">City</label>
                <input 
                  type="text" 
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:outline-none focus:border-luxury-gold" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold mb-2 block text-gray-500">State</label>
                <input 
                  type="text" 
                  value={address.state}
                  onChange={(e) => setAddress({...address, state: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:outline-none focus:border-luxury-gold" 
                />
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-10 bg-luxury-gold text-luxury-black flex items-center justify-center rounded-full font-bold">2</div>
              <h2 className="text-xl font-serif">Payment Method</h2>
            </div>
            
            <div className="p-8 border border-luxury-gold bg-luxury-gold/5 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center space-x-6">
                <CreditCard className="text-luxury-gold" size={32} />
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">Paystack</h4>
                  <p className="text-xs text-gray-400 mt-1">Cards, Bank Transfer, USSD</p>
                </div>
              </div>
              <div className="w-6 h-6 border-2 border-luxury-gold rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-luxury-gold rounded-full" />
              </div>
            </div>
          </section>

          <button 
            onClick={handleCheckoutClick}
            disabled={loading}
            className="luxury-button w-full h-20 text-lg space-x-4 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-luxury-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock size={20} />
                <span>PAY ${totalAmount.toLocaleString()} VIA PAYSTACK</span>
              </>
            )}
          </button>
        </div>

        {/* Order Review */}
        <div className="bg-white/5 border border-white/10 p-10 h-fit">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold mb-10 text-luxury-gold">Your Order</h2>
          <div className="space-y-8 mb-12 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {cart.map(item => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex space-x-4">
                <div className="w-16 h-20 bg-white/5 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-xs uppercase font-bold tracking-widest">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase">Qty: {item.quantity} | {item.size} | {item.color}</p>
                  <p className="text-xs text-luxury-gold mt-2 font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-500">
              <span>Subtotal</span>
              <span className="font-bold text-white">${totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-500">
              <span>Shipping</span>
              <span className="font-bold text-white">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-serif pt-4">
              <span>Total Due</span>
              <span className="text-luxury-gold font-bold">${totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-2 text-gray-500">
            <Lock size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">SSL Encrypted Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
