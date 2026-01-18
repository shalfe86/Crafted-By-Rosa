import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquareHeart } from 'lucide-react';

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white selection:bg-amber-500 selection:text-black">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-amber-900/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px]" 
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col justify-center items-center text-center">
        <motion.div 
          style={{ y: y1, opacity }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">
              Macrame • Bleach Art • DTF Prints • Painting
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl font-light leading-none tracking-tight bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent"
          >
            Crafted <span className="font-serif italic text-amber-500">by</span> Rosa
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed"
          >
            A diverse portfolio of handmade creations. From delicate baby toys and dream catchers to custom sublimation and hand-painted apparel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12"
          >
            <Link 
              to="/gallery" 
              className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-amber-200 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative font-medium tracking-wide flex items-center gap-2">
                View Gallery <ArrowRight size={18} />
              </span>
            </Link>
            
            <Link 
              to="/custom-request" 
              className="px-8 py-4 text-white border border-white/20 rounded-full hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              Start Custom Project
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Text Ring */}
      <motion.div 
        style={{ rotate: y2 }}
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] opacity-5 pointer-events-none border border-white/20 rounded-full flex items-center justify-center"
      >
        <div className="w-[80%] h-[80%] border border-white/10 rounded-full" />
      </motion.div>
    </div>
  );
};

export default Home;
