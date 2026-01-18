import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import CraftCard from '../components/CraftCard';

const Gallery: React.FC = () => {
  const { items, categories } = usePortfolio();
  const [filter, setFilter] = useState<string>('All');

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  const displayCategories = ['All', ...categories];

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-32 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8"
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-2">Curated Works</h2>
            <p className="text-gray-400">A collection of knots and chemistry.</p>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {displayCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm tracking-wide transition-all duration-300 whitespace-nowrap
                  ${filter === cat 
                    ? 'bg-amber-500 text-black font-medium' 
                    : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/30'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <CraftCard key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No items found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
