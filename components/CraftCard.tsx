import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PortfolioItem } from '../types';

interface CraftCardProps {
  item: PortfolioItem;
  index: number;
}

const CraftCard: React.FC<CraftCardProps> = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group relative break-inside-avoid mb-8"
    >
      <Link to={`/product/${item.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-10 transition-opacity duration-300 group-hover:opacity-80" />
          
          <motion.img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
            loading="lazy"
          />

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <span className="inline-block px-2 py-1 mb-2 text-xs tracking-widest uppercase text-amber-200 bg-amber-900/30 backdrop-blur-sm rounded border border-amber-500/20">
              {item.category}
            </span>
            <h3 className="text-2xl font-serif text-white mb-1">{item.title}</h3>
            <p className="text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {item.description}
            </p>
            <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 border-t border-white/10 pt-4">
              <span className="text-lg font-medium text-white">{item.price}</span>
              <div className="bg-white/10 p-2 rounded-full text-white transform group-hover:rotate-45 transition-all duration-300">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CraftCard;
