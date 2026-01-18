import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioItem, InitialCategories, ArtistProfile } from '../types';
import { PORTFOLIO_ITEMS } from '../constants';
import { supabase } from '../lib/supabaseClient';

interface PortfolioContextType {
  items: PortfolioItem[];
  categories: string[];
  artistProfile: ArtistProfile;
  addItem: (item: Omit<PortfolioItem, 'id'>) => Promise<void>;
  updateItem: (item: PortfolioItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  updateArtistProfile: (profile: ArtistProfile) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_ARTIST_PROFILE: ArtistProfile = {
  headline: "Crafting with",
  highlight: "Multifaceted Passion",
  description: "Hi, I'm Rosa. My creative journey doesn't follow a single path. I love the texture of natural fibers, the chemistry of bleach on fabric, and the endless possibilities of digital sublimation.\n\nFrom creating safe, intricate macrame toys for babies to designing bold custom shirts and painting abstracts on canvas, I pour my heart into every medium.\n\nI believe in making things that are personal. That's why I love working directly with people to create custom dream catchers, specific plant hanger sizes, or one-of-a-kind apparel that speaks to their style.",
  imageUrl: "https://placehold.co/800x1200/18181b/a1a1aa?text=Upload+Photo"
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>(InitialCategories);
  const [artistProfile, setArtistProfile] = useState<ArtistProfile>(DEFAULT_ARTIST_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data on Mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Portfolio Items
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('id', { ascending: false }); // Show newest first usually, or use created_at

      if (portfolioError) console.error('Error fetching items:', portfolioError);
      else if (portfolioData) {
         // Map DB columns to Typescript Interface if names differ, assuming they match here based on prompt
         setItems(portfolioData.map(d => ({
            id: d.id,
            title: d.title,
            category: d.category,
            imageUrl: d.image_url,
            description: d.description,
            price: d.price
         })));
      }

      // 2. Fetch Categories
      const { data: catData, error: catError } = await supabase.from('categories').select('*');
      if (catError) console.error('Error fetching categories:', catError);
      else if (catData && catData.length > 0) {
        setCategories(catData.map(c => c.name));
      }

      // 3. Fetch Artist Profile
      // Order by ID descending to ensure we get the latest single profile entry if multiple exist
      const { data: profileData, error: profileError } = await supabase
        .from('artist_profile')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);

      if (profileError) console.error('Error fetching profile:', profileError);
      else if (profileData && profileData.length > 0) {
        const p = profileData[0];
        setArtistProfile({
            headline: p.headline,
            highlight: p.highlight,
            description: p.description,
            imageUrl: p.image_url || DEFAULT_ARTIST_PROFILE.imageUrl
        });
      } else {
        // Use default if no row exists yet
        setArtistProfile(DEFAULT_ARTIST_PROFILE);
      }

    } catch (e) {
      console.error("Unexpected error fetching data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Item Logic
  const addItem = async (newItem: Omit<PortfolioItem, 'id'>) => {
    try {
      const { data, error } = await supabase.from('portfolio_items').insert([{
        title: newItem.title,
        category: newItem.category,
        image_url: newItem.imageUrl,
        description: newItem.description,
        price: newItem.price
      }]).select();

      if (error) throw error;
      if (data) {
        setItems(prev => [{
            id: data[0].id,
            title: data[0].title,
            category: data[0].category,
            imageUrl: data[0].image_url,
            description: data[0].description,
            price: data[0].price
        }, ...prev]);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item to database.");
    }
  };

  const updateItem = async (updatedItem: PortfolioItem) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update({
            title: updatedItem.title,
            category: updatedItem.category,
            image_url: updatedItem.imageUrl,
            description: updatedItem.description,
            price: updatedItem.price
        })
        .eq('id', updatedItem.id);

      if (error) throw error;

      setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
       console.error("Error deleting item:", error);
       alert("Failed to delete item.");
    }
  };

  // Category Logic
  const addCategory = async (category: string) => {
    if (!categories.includes(category)) {
      try {
        const { error } = await supabase.from('categories').insert([{ name: category }]);
        if (error) throw error;
        setCategories(prev => [...prev, category]);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const deleteCategory = async (category: string) => {
    try {
        const { error } = await supabase.from('categories').delete().eq('name', category);
        if (error) throw error;
        setCategories(prev => prev.filter(c => c !== category));
    } catch (error) {
        console.error("Error deleting category:", error);
    }
  };

  // Artist Profile Logic
  const updateArtistProfile = async (profile: ArtistProfile) => {
    try {
        // Check if a profile exists
        const { data: existing } = await supabase.from('artist_profile').select('id').order('id', { ascending: false }).limit(1);
        
        let error;
        if (existing && existing.length > 0) {
            // Update
             const { error: updateError } = await supabase.from('artist_profile').update({
                headline: profile.headline,
                highlight: profile.highlight,
                description: profile.description,
                image_url: profile.imageUrl
            }).eq('id', existing[0].id);
            error = updateError;
        } else {
            // Insert
            const { error: insertError } = await supabase.from('artist_profile').insert([{
                headline: profile.headline,
                highlight: profile.highlight,
                description: profile.description,
                image_url: profile.imageUrl
            }]);
            error = insertError;
        }

        if (error) throw error;
        setArtistProfile(profile);

    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to save profile.");
    }
  };

  const resetToDefaults = async () => {
    if (confirm('Are you sure? This will delete all DB data and reset to defaults.')) {
        setIsLoading(true);
        try {
             // Delete all existing
             await supabase.from('portfolio_items').delete().neq('id', 0); // Hack to delete all
             await supabase.from('categories').delete().neq('id', 0);
             // Re-insert default items
             for (const item of PORTFOLIO_ITEMS) {
                 await supabase.from('portfolio_items').insert({
                    title: item.title,
                    category: item.category,
                    image_url: item.imageUrl,
                    description: item.description,
                    price: item.price
                 });
             }
             // Re-insert default categories
             for (const cat of InitialCategories) {
                await supabase.from('categories').insert({ name: cat });
             }

             // Refresh local state
             await fetchData();
             
        } catch (e) {
            console.error("Reset failed", e);
        } finally {
            setIsLoading(false);
        }
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
      resetToDefaults,
      isLoading
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