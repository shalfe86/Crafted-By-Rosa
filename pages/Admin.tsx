import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioItem, ArtistProfile } from '../types';
import { 
  Trash2, Plus, Edit2, Save, X, Lock, RotateCcw, 
  LayoutDashboard, Image as ImageIcon, UploadCloud, 
  BarChart3, ShoppingCart, TrendingUp, Users, User, Loader2, LogOut
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Admin: React.FC = () => {
  const { items, categories, artistProfile, addItem, updateItem, deleteItem, addCategory, deleteCategory, updateArtistProfile, resetToDefaults, isLoading: contextLoading } = usePortfolio();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'artist'>('overview');
  
  // Dashboard Stats
  const [activeCartsCount, setActiveCartsCount] = useState(0);
  const [totalTraffic, setTotalTraffic] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  
  // Edit/Add State
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PortfolioItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    category: categories[0] || 'Macrame',
    imageUrl: '',
  });

  // State for file objects (needed for Supabase Upload)
  const [newItemFile, setNewItemFile] = useState<File | null>(null);
  const [editItemFile, setEditItemFile] = useState<File | null>(null);
  const [artistItemFile, setArtistItemFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Artist Profile State
  const [artistForm, setArtistForm] = useState<ArtistProfile>(artistProfile);
  const [artistSaved, setArtistSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const artistImageInputRef = useRef<HTMLInputElement>(null);

  // Check for active session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Dashboard Stats when Overview is active
  useEffect(() => {
    if (isAuthenticated && activeTab === 'overview') {
        const fetchStats = async () => {
            try {
                // 1. Fetch active carts
                const { data: activeData } = await supabase
                    .from('active_carts')
                    .select('items');
                
                if (activeData) {
                    const active = activeData.filter((row: any) => Array.isArray(row.items) && row.items.length > 0).length;
                    setActiveCartsCount(active);
                }

                // 2. Fetch Total Traffic (Count of all rows)
                const { count: trafficCount } = await supabase
                    .from('site_traffic')
                    .select('*', { count: 'exact', head: true });
                
                if (trafficCount !== null) {
                    setTotalTraffic(trafficCount);
                }

                // 3. Fetch Total Sales (Sum of total_amount)
                const { data: salesData } = await supabase
                    .from('purchases')
                    .select('total_amount');

                if (salesData) {
                    const total = salesData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
                    setTotalSales(total);
                }

            } catch (e) {
                console.error("Error fetching stats", e);
            }
        };
        fetchStats();
        
        // Optional: Set up an interval to poll every minute
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }
  }, [isAuthenticated, activeTab]);

  // Update artist form if context changes (e.g. after reset or initial fetch)
  useEffect(() => {
    setArtistForm(artistProfile);
  }, [artistProfile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      // State update handled by onAuthStateChange listener
    } catch (error: any) {
      alert(error.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /**
   * Helper to upload file to Supabase Storage
   */
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Image upload failed: ${error.message}`);
      return null;
    }
  };

  // --- Image Selection Handlers (Previews) ---

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent, mode: 'new' | 'edit' | 'artist') => {
    let file: File | undefined;

    if ('dataTransfer' in e) {
       e.preventDefault();
       file = e.dataTransfer.files[0];
    } else {
       file = e.target.files?.[0];
    }

    if (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        alert('Only JPEG and PNG files are allowed.');
        return;
      }

      // Create local preview
      const previewUrl = URL.createObjectURL(file);

      // Set State
      if (mode === 'new') {
        setNewItem(prev => ({ ...prev, imageUrl: previewUrl }));
        setNewItemFile(file);
      } else if (mode === 'edit') {
        setEditForm(prev => ({ ...prev, imageUrl: previewUrl }));
        setEditItemFile(file);
      } else if (mode === 'artist') {
        setArtistForm(prev => ({ ...prev, imageUrl: previewUrl }));
        setArtistItemFile(file);
      }
    }
  };

  // --- Save Actions ---

  const handleSaveNew = async () => {
    if (newItem.title && newItem.description && newItem.category && newItem.imageUrl) {
      setIsUploading(true);
      let finalImageUrl = newItem.imageUrl;

      if (newItemFile) {
        const uploadedUrl = await uploadImage(newItemFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
        else {
           setIsUploading(false);
           return; // Abort if upload failed
        }
      }

      await addItem({ ...newItem, imageUrl: finalImageUrl } as Omit<PortfolioItem, 'id'>);
      
      setIsAdding(false);
      setNewItem({ category: categories[0], imageUrl: '' });
      setNewItemFile(null);
      setIsUploading(false);
    } else {
      alert('Please fill in all fields and upload an image');
    }
  };

  const startEdit = (item: PortfolioItem) => {
    setIsEditing(item.id);
    setEditForm({ ...item });
    setEditItemFile(null); // Reset file
  };

  const saveEdit = async () => {
    if (editForm.id && editForm.title) {
      setIsUploading(true);
      let finalImageUrl = editForm.imageUrl || '';

      if (editItemFile) {
        const uploadedUrl = await uploadImage(editItemFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
        else {
          setIsUploading(false);
          return;
        }
      }

      await updateItem({ ...editForm, imageUrl: finalImageUrl } as PortfolioItem);
      setIsEditing(null);
      setEditItemFile(null);
      setIsUploading(false);
    }
  };

  const handleSaveArtistProfile = async () => {
    setIsUploading(true);
    let finalImageUrl = artistForm.imageUrl;

    if (artistItemFile) {
      const uploadedUrl = await uploadImage(artistItemFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
      else {
        setIsUploading(false);
        return;
      }
    }

    await updateArtistProfile({ ...artistForm, imageUrl: finalImageUrl });
    setArtistItemFile(null);
    setIsUploading(false);
    setArtistSaved(true);
    setTimeout(() => setArtistSaved(false), 2000);
  }

  const handleAddCategory = () => {
    if(newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-md text-center"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-serif text-white mb-2">Atelier Access</h2>
          <p className="text-gray-400 text-sm mb-6">Please sign in with your Supabase credentials.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-amber-500 outline-none"
              placeholder="admin@email.com"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-amber-500 outline-none"
              placeholder="Password"
              required
            />
            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {authLoading ? <Loader2 className="animate-spin" size={20} /> : 'Unlock'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-32 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-serif text-white mb-6">Admin Portal</h2>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <LayoutDashboard size={20} /> Overview
              </button>
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'portfolio' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <ImageIcon size={20} /> Manage Portfolio
              </button>
              <button 
                onClick={() => setActiveTab('artist')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'artist' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <User size={20} /> Artist Profile
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
              >
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>
          
          <button 
            onClick={resetToDefaults}
            className="w-full px-4 py-3 border border-red-900/50 text-red-500 rounded-xl hover:bg-red-900/10 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw size={16} /> Reset All Data
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users size={64} />
                  </div>
                  <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Page Views</h3>
                  <div className="text-4xl font-serif text-white">{totalTraffic}</div>
                  <div className="text-green-500 text-sm flex items-center gap-1 mt-2"><TrendingUp size={14} /> Live Tracking</div>
                </div>

                <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BarChart3 size={64} />
                  </div>
                  <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Revenue</h3>
                  <div className="text-4xl font-serif text-white">${totalSales.toFixed(2)}</div>
                  <div className="text-green-500 text-sm flex items-center gap-1 mt-2"><TrendingUp size={14} /> All Time</div>
                </div>

                <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShoppingCart size={64} />
                  </div>
                  <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Active Carts Live</h3>
                  <div className="text-4xl font-serif text-amber-500">{activeCartsCount}</div>
                  <div className="text-gray-500 text-sm mt-2">Potential customers</div>
                </div>
              </div>

              {/* Fake Chart Visualization */}
              <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl">
                <h3 className="text-xl font-serif mb-6">Traffic Overview</h3>
                <div className="flex items-end gap-2 h-48 w-full">
                   {[40, 65, 34, 78, 56, 89, 45, 67, 88, 54, 76, 92].map((h, i) => (
                     <div key={i} className="flex-1 bg-amber-900/40 hover:bg-amber-600 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h * 10}</div>
                     </div>
                   ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500 uppercase">
                  <span>Jan</span><span>Dec</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* PORTFOLIO TAB */}
          {activeTab === 'portfolio' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              
              {/* Category Manager */}
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-xl font-serif mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map(cat => (
                    <div key={cat} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="text-sm">{cat}</span>
                      <button onClick={() => deleteCategory(cat)} className="text-gray-500 hover:text-red-400"><X size={14} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="New Category Name"
                    className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 flex-1 focus:border-amber-500 outline-none"
                  />
                  <button onClick={handleAddCategory} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white">Add</button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-serif">Items</h3>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
                >
                  <Plus size={18} /> Add Item
                </button>
              </div>

              {/* Add New Item Form */}
              <AnimatePresence>
                {isAdding && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 mb-8 overflow-hidden"
                  >
                    <h3 className="text-lg font-medium mb-4 text-amber-500">New Creation</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <input 
                          placeholder="Title"
                          className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-amber-500 outline-none"
                          value={newItem.title || ''}
                          onChange={e => setNewItem({...newItem, title: e.target.value})}
                        />
                        <select 
                          className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-amber-500 outline-none"
                          value={newItem.category}
                          onChange={e => setNewItem({...newItem, category: e.target.value})}
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input 
                          placeholder="Price (e.g., $45)"
                          className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-amber-500 outline-none"
                          value={newItem.price || ''}
                          onChange={e => setNewItem({...newItem, price: e.target.value})}
                        />
                        
                        {/* Image Upload Dropzone */}
                        <div 
                          className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:bg-white/5 transition-colors cursor-pointer relative"
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => handleImageSelect(e, 'new')}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            hidden 
                            accept="image/png, image/jpeg"
                            onChange={e => handleImageSelect(e, 'new')}
                          />
                          {newItem.imageUrl ? (
                            <img src={newItem.imageUrl} className="h-32 mx-auto object-cover rounded" alt="Preview" />
                          ) : (
                            <div className="py-4 text-gray-400">
                              <UploadCloud className="mx-auto mb-2" />
                              <p className="text-xs">Drag & Drop or Click to Upload</p>
                              <p className="text-[10px] text-gray-600">JPG or PNG only</p>
                            </div>
                          )}
                        </div>

                      </div>
                      <div className="space-y-4">
                        <textarea 
                          placeholder="Description"
                          className="w-full h-full bg-black/50 border border-white/10 rounded-lg p-3 min-h-[150px] focus:border-amber-500 outline-none"
                          value={newItem.description || ''}
                          onChange={e => setNewItem({...newItem, description: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button 
                        onClick={() => setIsAdding(false)} 
                        className="px-6 py-2 text-gray-400 hover:text-white"
                        disabled={isUploading}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveNew} 
                        disabled={isUploading}
                        className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 flex items-center gap-2"
                      >
                        {isUploading && <Loader2 className="animate-spin" size={16} />}
                        Save Item
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* List Items */}
              {contextLoading ? (
                  <div className="flex justify-center py-10">
                      <Loader2 className="animate-spin text-amber-500" size={32} />
                  </div>
              ) : (
                <div className="grid gap-4">
                    {items.map(item => (
                    <motion.div 
                        layout
                        key={item.id} 
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center"
                    >
                        <div className="relative group w-20 h-20 flex-shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-lg bg-white/10" />
                        {isEditing === item.id && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer">
                                <label className="cursor-pointer p-2">
                                <UploadCloud size={16} />
                                <input type="file" hidden accept="image/png, image/jpeg" onChange={e => handleImageSelect(e, 'edit')} />
                                </label>
                            </div>
                        )}
                        </div>
                        
                        {isEditing === item.id ? (
                        <div className="flex-1 w-full grid md:grid-cols-2 gap-4">
                            <input 
                            value={editForm.title} 
                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 focus:border-amber-500 outline-none"
                            />
                            <input 
                            value={editForm.price} 
                            onChange={e => setEditForm({...editForm, price: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 focus:border-amber-500 outline-none"
                            />
                            <select 
                            value={editForm.category}
                            onChange={e => setEditForm({...editForm, category: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 focus:border-amber-500 outline-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <textarea 
                            value={editForm.description} 
                            onChange={e => setEditForm({...editForm, description: e.target.value})}
                            className="bg-black/50 border border-white/10 rounded p-2 md:col-span-2 focus:border-amber-500 outline-none"
                            />
                        </div>
                        ) : (
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                            <h3 className="text-xl font-serif">{item.title}</h3>
                            <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-gray-400 w-fit mx-auto md:mx-0">{item.category}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{item.description}</p>
                            <p className="text-amber-500 font-medium">{item.price}</p>
                        </div>
                        )}

                        <div className="flex gap-2">
                        {isEditing === item.id ? (
                            <>
                            <button 
                                onClick={saveEdit} 
                                disabled={isUploading}
                                className="p-2 bg-green-900/50 text-green-400 rounded hover:bg-green-900 disabled:opacity-50"
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            </button>
                            <button onClick={() => setIsEditing(null)} disabled={isUploading} className="p-2 bg-white/5 text-gray-400 rounded hover:bg-white/10"><X size={18} /></button>
                            </>
                        ) : (
                            <>
                            <button onClick={() => startEdit(item)} className="p-2 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50"><Edit2 size={18} /></button>
                            <button onClick={() => deleteItem(item.id)} className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50"><Trash2 size={18} /></button>
                            </>
                        )}
                        </div>
                    </motion.div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ARTIST PROFILE TAB */}
          {activeTab === 'artist' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-serif">Edit Artist Profile</h3>
                    {artistSaved && (
                        <span className="text-green-500 flex items-center gap-2 text-sm"><CheckIcon /> Saved Successfully</span>
                    )}
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <label className="block text-sm text-gray-400 uppercase tracking-wider">Profile Photo</label>
                        <div 
                          className="relative aspect-[3/4] bg-black/40 border-2 border-dashed border-white/10 rounded-xl overflow-hidden group cursor-pointer hover:border-amber-500/50 transition-colors"
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => handleImageSelect(e, 'artist')}
                          onClick={() => artistImageInputRef.current?.click()}
                        >
                             <img src={artistForm.imageUrl} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <UploadCloud size={32} className="mb-2 text-amber-500" />
                                <span className="text-sm">Click or Drag to Update</span>
                             </div>
                             <input 
                                type="file" 
                                hidden 
                                ref={artistImageInputRef}
                                accept="image/png, image/jpeg"
                                onChange={e => handleImageSelect(e, 'artist')} 
                             />
                        </div>
                    </div>

                    {/* Text Fields */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <label className="block text-sm text-gray-400 uppercase tracking-wider">Headline</label>
                             <input 
                                value={artistForm.headline}
                                onChange={e => setArtistForm({...artistForm, headline: e.target.value})}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-amber-500 outline-none text-lg font-serif"
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm text-gray-400 uppercase tracking-wider">Highlighted Text (Amber)</label>
                             <input 
                                value={artistForm.highlight}
                                onChange={e => setArtistForm({...artistForm, highlight: e.target.value})}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-amber-500 outline-none text-lg font-serif text-amber-500"
                             />
                        </div>
                        <div className="space-y-2 h-full">
                             <label className="block text-sm text-gray-400 uppercase tracking-wider">Biography</label>
                             <textarea 
                                value={artistForm.description}
                                onChange={e => setArtistForm({...artistForm, description: e.target.value})}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-amber-500 outline-none h-[300px] resize-none leading-relaxed"
                                placeholder="Write the artist bio here..."
                             />
                        </div>
                    </div>
                 </div>

                 <div className="flex justify-end mt-8">
                    <button 
                        onClick={handleSaveArtistProfile}
                        disabled={isUploading}
                        className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default Admin;
