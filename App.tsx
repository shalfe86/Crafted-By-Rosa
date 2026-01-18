import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import CustomRequest from './pages/CustomRequest';
import About from './pages/About';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import { AnimatePresence } from 'framer-motion';
import { PortfolioProvider } from './context/PortfolioContext';
import { CartProvider } from './context/CartContext';

// Scroll to top wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="bg-black min-h-screen text-white font-sans antialiased selection:bg-amber-500/30">
            <Navigation />
            
            {/* AnimatePresence for page transitions */}
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/custom-request" element={<CustomRequest />} />
                <Route path="/about" element={<About />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </CartProvider>
    </PortfolioProvider>
  );
};

export default App;
