import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, CreditCard, Lock, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Unified form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);

    try {
      // Structure the data to match the SQL schema provided
      // The table has columns: customer_email, total_amount, items (jsonb)
      // We bundle the shipping address into the JSON items along with the products
      const purchaseData = {
        customer_email: formData.email,
        total_amount: cartTotal,
        items: {
            products: cartItems,
            shipping_details: {
                name: formData.name,
                address_line1: formData.address1,
                address_line2: formData.address2,
                city: formData.city,
                state: formData.state,
                zip: formData.zip
            }
        }
      };

      const { error } = await supabase
        .from('purchases')
        .insert([purchaseData]);

      if (error) throw error;

      setIsSuccess(true);
      clearCart();
      setFormData({ name: '', email: '', address1: '', address2: '', city: '', state: '', zip: '' });

    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('There was an issue processing your order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 pb-32 px-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-serif mb-4">Order Confirmed</h2>
          <p className="text-gray-400 mb-8">
            Thank you, {formData.name || 'Art Lover'}! <br/>
            We have sent a confirmation to <strong>{formData.email}</strong>.
          </p>
          <Link to="/gallery" onClick={() => setIsSuccess(false)} className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
            Continue Browsing
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 pb-32 px-6 flex flex-col items-center justify-center text-center">
        <ShoppingBag size={64} className="text-gray-700 mb-6" />
        <h2 className="text-3xl font-serif mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't found the perfect piece yet. Explore the gallery to find something unique.</p>
        <Link to="/gallery" className="px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
          View Gallery <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-12">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div 
                  key={`${item.id}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex gap-4 md:gap-6 bg-zinc-900/50 border border-white/10 p-4 rounded-2xl items-center"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-lg md:text-xl truncate pr-4">{item.title}</h3>
                      <p className="font-medium text-amber-500 whitespace-nowrap">{item.price}</p>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{item.category}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-3xl sticky top-32">
              <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-amber-500"/> Shipping Details
              </h3>
              
              <form onSubmit={handleCheckout} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                   <label className="text-xs uppercase text-gray-500 tracking-wider">Full Name</label>
                   <input 
                     required 
                     className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 outline-none" 
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />
                </div>

                {/* Email */}
                <div className="space-y-2">
                   <label className="text-xs uppercase text-gray-500 tracking-wider">Email Address</label>
                   <input 
                     required 
                     type="email"
                     className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 outline-none" 
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                   />
                </div>

                {/* Address Line 1 */}
                <div className="space-y-2">
                   <label className="text-xs uppercase text-gray-500 tracking-wider">Address</label>
                   <input 
                     required 
                     placeholder="123 Craft Lane"
                     className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 outline-none" 
                     value={formData.address1}
                     onChange={(e) => setFormData({...formData, address1: e.target.value})}
                   />
                </div>

                {/* Address Line 2 */}
                <div className="space-y-2">
                   <input 
                     placeholder="Apt, Suite, Unit (Optional)"
                     className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 outline-none" 
                     value={formData.address2}
                     onChange={(e) => setFormData({...formData, address2: e.target.value})}
                   />
                </div>

                {/* City / State / Zip */}
                <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-3 space-y-2">
                        <label className="text-[10px] uppercase text-gray-500 tracking-wider">City</label>
                        <input 
                            required 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 outline-none" 
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                    </div>
                    <div className="col-span-1 space-y-2">
                        <label className="text-[10px] uppercase text-gray-500 tracking-wider">State</label>
                        <input 
                            required 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 outline-none" 
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                        />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase text-gray-500 tracking-wider">Zip</label>
                        <input 
                            required 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 outline-none" 
                            value={formData.zip}
                            onChange={(e) => setFormData({...formData, zip: e.target.value})}
                        />
                    </div>
                </div>

                <div className="h-px bg-white/10 my-6" />

                <div className="flex justify-between text-xl font-medium mb-6">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <button 
                  disabled={isCheckingOut}
                  type="submit"
                  className="w-full py-4 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Processing...
                    </>
                  ) : (
                    <>
                      Place Order <Lock size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-4 text-gray-600 opacity-50">
                <CreditCard size={20} />
                <span className="text-xs">Secure SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
