import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioItem, InitialCategories, ArtistProfile } from '../types';
import { PORTFOLIO_ITEMS } from '../constants';

interface PortfolioContextType {
  items: PortfolioItem[];
  categories: string[];
  artistProfile: ArtistProfile;
  addItem: (item: Omit<PortfolioItem, 'id'>) => void;
  updateItem: (item: PortfolioItem) => void;
  deleteItem: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  updateArtistProfile: (profile: ArtistProfile) => void;
  resetToDefaults: () => void;
}

const DEFAULT_ARTIST_PROFILE: ArtistProfile = {
  headline: "Crafting with",
  highlight: "Multifaceted Passion",
  description: "Hi, I'm Rosa. My creative journey doesn't follow a single path. I love the texture of natural fibers, the chemistry of bleach on fabric, and the endless possibilities of digital sublimation.\n\nFrom creating safe, intricate macrame toys for babies to designing bold custom shirts and painting abstracts on canvas, I pour my heart into every medium.\n\nI believe in making things that are personal. That's why I love working directly with people to create custom dream catchers, specific plant hanger sizes, or one-of-a-kind apparel that speaks to their style.",
  imageUrl: "https://picsum.photos/800/1200?random=99"
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load Items
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse portfolio data', e);
      }
    }
    return PORTFOLIO_ITEMS;
  });

  // Load Categories
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('portfolio_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse categories', e);
      }
    }
    return InitialCategories;
  });

  // Load Artist Profile
  const [artistProfile, setArtistProfile] = useState<ArtistProfile>(() => {
    const saved = localStorage.getItem('artist_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse artist profile', e);
      }
    }
    return DEFAULT_ARTIST_PROFILE;
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('portfolio_data', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('portfolio_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('artist_profile', JSON.stringify(artistProfile));
  }, [artistProfile]);

  // Item Logic
  const addItem = (newItem: Omit<PortfolioItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setItems(prev => [{ ...newItem, id }, ...prev]);
  };

  const updateItem = (updatedItem: PortfolioItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Category Logic
  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const deleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  // Artist Profile Logic
  const updateArtistProfile = (profile: ArtistProfile) => {
    setArtistProfile(profile);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure? This will delete all custom changes and revert to the original code.')) {
      setItems(PORTFOLIO_ITEMS);
      setCategories(InitialCategories);
      setArtistProfile(DEFAULT_ARTIST_PROFILE);
    }
  };

  return (
    <PortfolioContext.Provider value={{ 
      items, 
      categories, 
      artistProfile,
      addItem, 
      updateItem, 
      deleteItem, 
      addCategory, 
      deleteCategory, 
      updateArtistProfile,
      resetToDefaults 
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
