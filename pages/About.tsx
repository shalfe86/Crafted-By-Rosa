import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const About: React.FC = () => {
  const { artistProfile } = usePortfolio();

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6 py-24">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-[3/4] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            <img 
              src={artistProfile.imageUrl} 
              alt="The Artist" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-600 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight">
            {artistProfile.headline} <br/>
            <span className="text-amber-500 italic">{artistProfile.highlight}</span>
          </h1>

          <div className="space-y-6 text-gray-400 font-light text-lg leading-relaxed whitespace-pre-line">
            {artistProfile.description}
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="block text-2xl font-serif text-white mb-1">Diverse</span>
                <span className="text-sm text-gray-500 uppercase tracking-wider">Mediums</span>
              </div>
              <div>
                <span className="block text-2xl font-serif text-white mb-1">100%</span>
                <span className="text-sm text-gray-500 uppercase tracking-wider">Handmade & Custom</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
