import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquareHeart, Share2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items, isLoading } = usePortfolio();
  const navigate = useNavigate();
  
  const item = items.find(i => i.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!item) {
    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center gap-6">
            <h2 className="text-4xl font-serif text-gray-400">Creation not found</h2>
            <Link to="/gallery" className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                Return to Gallery
            </Link>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-32 px-6 md:px-12 lg:pt-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Back Navigation */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
        >
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="uppercase tracking-widest text-xs">Back</span>
            </button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20">
            
            {/* Image Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[4/5] lg:aspect-square bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
                <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </motion.div>

            {/* Details Section */}
            <div className="flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full border border-amber-500/30 text-amber-500 text-[10px] md:text-xs tracking-widest uppercase bg-amber-900/10">
                            {item.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1]">
                        {item.title}
                    </h1>

                    <div className="text-2xl md:text-3xl font-light text-white/90">
                        {item.price}
                    </div>

                    <div className="h-px w-full bg-white/10 my-6 md:my-8" />

                    <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
                        {item.description}
                    </p>

                    <p className="text-gray-500 text-sm leading-relaxed mt-4">
                        Each piece is handmade with attention to detail and high-quality materials. Due to the nature of handcrafted items, slight variations may occur, making your piece truly unique.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                        <Link 
                            to="/custom-request"
                            className="flex-1 bg-white text-black py-4 rounded-xl font-medium hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            <MessageSquareHeart size={18} />
                            Inquire / Request Custom
                        </Link>
                        <button className="px-6 py-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white flex items-center justify-center" title="Share">
                            <Share2 size={18} />
                        </button>
                    </div>

                </motion.div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
