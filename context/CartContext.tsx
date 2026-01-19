import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { supabase } from '../lib/supabaseClient';

interface CartContextType {
  cartItems: PortfolioItem[];
  addToCart: (item: PortfolioItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  guestId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<PortfolioItem[]>([]);
  const [guestId, setGuestId] = useState<string | null>(null);

  // 1. Initialize Guest ID
  useEffect(() => {
    let id = localStorage.getItem('rosa_guest_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('rosa_guest_id', id);
    }
    setGuestId(id);
  }, []);

  // 2. Load Cart from Supabase
  useEffect(() => {
    if (!guestId) return;

    const fetchRemoteCart = async () => {
      try {
        const { data, error } = await supabase
          .from('active_carts')
          .select('items')
          .eq('guest_id', guestId)
          .single();

        if (data && Array.isArray(data.items)) {
          setCartItems(data.items);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchRemoteCart();
  }, [guestId]);

  // Helper to sync changes to Supabase
  const syncCartToDb = async (newItems: PortfolioItem[]) => {
    if (!guestId) return;
    
    // We use upsert to insert if new or update if exists
    const { error } = await supabase
      .from('active_carts')
      .upsert({ 
        guest_id: guestId, 
        items: newItems,
        updated_at: new Date().toISOString()
      });

    if (error) console.error("Failed to sync cart:", error);
  };

  const addToCart = (item: PortfolioItem) => {
    setCartItems(prev => {
      const newCart = [...prev, item];
      syncCartToDb(newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const index = prev.findIndex(i => i.id === itemId);
      if (index > -1) {
        const newCart = [...prev];
        newCart.splice(index, 1);
        syncCartToDb(newCart);
        return newCart;
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    syncCartToDb([]);
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
      cartCount: cartItems.length,
      guestId
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
