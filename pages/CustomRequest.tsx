import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const CustomRequest: React.FC = () => {
  const { categories } = usePortfolio();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: categories[0] || 'Macrame',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate network request
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32 px-4 relative">
       {/* Background Gradients */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 text-amber-500 mb-6">
            <MessageSquareHeart className="w-6 h-6" />
            <span className="uppercase tracking-widest text-sm font-semibold">Commission A Piece</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
            Bring your vision <br/>
            <span className="text-gray-600 italic">to life.</span>
          </h1>

          <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed mb-12">
            <p>
              Whether it's a specific size plant hanger for your favorite corner, a custom DTF shirt for an event, or a unique bleach-painted design, I love collaborating on new ideas.
            </p>
            <p>
              Fill out the form to start a conversation. We'll discuss materials, sizing, and pricing to create something perfect for you.
            </p>
          </div>

          <div className="hidden lg:block p-8 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-white font-serif text-2xl mb-4">Current Turnaround</h3>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Macrame & Fiber Art</span>
              <span className="text-white">1-2 Weeks</span>
            </div>
            <div className="w-full h-px bg-white/10 my-3" />
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Custom Apparel (DTF/Bleach)</span>
              <span className="text-white">3-5 Days</span>
            </div>
             <div className="w-full h-px bg-white/10 my-3" />
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Paintings</span>
              <span className="text-white">2-3 Weeks</span>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900/50 backdrop-blur-md border border-amber-500/30 rounded-3xl p-12 text-center"
              >
                <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-serif text-white mb-4">Request Sent!</h3>
                <p className="text-gray-400 mb-8">
                  Thank you for reaching out. Rosa will review your request and get back to you at <strong>{formData.email}</strong> shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-amber-500 hover:text-amber-400 underline decoration-amber-500/30 underline-offset-4"
                >
                  Send another request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Email</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="hello@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Craft Type</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other">Other / Combination</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Your Vision</label>
                  <textarea 
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 transition-colors h-40 resize-none"
                    placeholder="Tell me about the colors, size, and style you are looking for..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-white text-black font-medium rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 group"
                >
                  Send Request <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomRequest;
