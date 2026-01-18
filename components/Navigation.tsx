import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Grid, MessageSquareHeart, User, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [secretCount, setSecretCount] = useState(0);

  // Reset secret count if user stops clicking for 1 second
  useEffect(() => {
    const timer = setTimeout(() => setSecretCount(0), 1000);
    return () => clearTimeout(timer);
  }, [secretCount]);

  const handleSecretClick = (e: React.MouseEvent) => {
    // If clicking the Artist/User icon
    setSecretCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        navigate('/admin');
        return 0;
      }
      return newCount;
    });
  };

  const navItems = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/gallery", icon: <Grid size={20} />, label: "Gallery" },
    { to: "/custom-request", icon: <MessageSquareHeart size={20} />, label: "Custom" },
    { to: "/about", icon: <User size={20} />, label: "Artist", isSecret: true },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 px-2 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={item.isSecret ? handleSecretClick : undefined}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300
              ${isActive ? 'text-black bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'text-white/60 hover:text-white hover:bg-white/10'}
            `}
          >
            {({ isActive }) => (
              <>
                {item.icon}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full mix-blend-difference"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
        
        {/* Decorative separator */}
        <div className="w-px h-6 bg-white/10 mx-1"></div>

        <button className="flex items-center justify-center w-12 h-12 rounded-full text-amber-400 hover:bg-amber-400/10 transition-colors">
          <ShoppingBag size={20} />
        </button>

      </motion.nav>
    </div>
  );
};

export default Navigation;
