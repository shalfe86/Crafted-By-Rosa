import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioItem } from '../types';

interface CartContextType {
  cartItems: PortfolioItem[];
  addToCart: (item: PortfolioItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<PortfolioItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rosa_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('rosa_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: PortfolioItem) => {
    // For unique items, we might check duplicates, but for prints/general we allow multiples
    // We add a temporary unique ID for the cart instance if we wanted to allow duplicates of same item ID
    // keeping it simple for now.
    setCartItems(prev => [...prev, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const index = prev.findIndex(i => i.id === itemId);
      if (index > -1) {
        const newCart = [...prev];
        newCart.splice(index, 1);
        return newCart;
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    // Parse "$85" -> 85
    const priceNumber = parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0');
    return total + priceNumber;
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      cartTotal,
      cartCount: cartItems.length
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
