import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, RefreshCw, Wand2 } from 'lucide-react';
import { generateCraftConcept, generateConceptImage } from '../services/geminiService';
import { GeneratedConcept } from '../types';

const Workshop: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Modern Boho');
  const [isLoading, setIsLoading] = useState(false);
  const [concept, setConcept] = useState<GeneratedConcept | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setConcept(null);
    setLoadingStep('Weaving ideas from the ether...');

    try {
      // 1. Generate the Text Concept
      const idea = await generateCraftConcept(prompt, style);
      setLoadingStep('Visualizing the design...');
      
      // 2. Generate the Image Visualization
      const imageUrl = await generateConceptImage(idea.visualPrompt);
      
      setConcept({ idea, imageUrl });
    } catch (error) {
      console.error(error);
      alert('The creative spirits are busy. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32 px-4 relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16">
        
        {/* Input Section */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-amber-500 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm font-semibold">AI Design Atelier</span>
            </div>
            
            <h1 className="text-5xl font-serif mb-6 leading-tight">
              Dream it. <br/>
              <span className="text-gray-500 italic">We'll visualize it.</span>
            </h1>
            
            <p className="text-gray-400 mb-10 text-lg font-light">
              Describe a feeling, a theme, or a vague idea. Our AI Muse will draft a unique Macrame or Bleach Art project tailored just for you.
            </p>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm uppercase tracking-wide text-gray-500">Your Inspiration</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A dark gothic bleach shirt with raven wings, or a macrame plant hanger for a futuristic apartment..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all h-32 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm uppercase tracking-wide text-gray-500">Artistic Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option>Modern Boho</option>
                  <option>Dark/Gothic</option>
                  <option>Minimalist</option>
                  <option>Celestial</option>
                  <option>Organic/Nature</option>
                  <option>Avant-Garde</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading || !prompt}
                className={`
                  w-full py-5 rounded-xl font-medium tracking-wide flex items-center justify-center gap-3 transition-all
                  ${isLoading || !prompt 
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:scale-[1.02] shadow-lg shadow-amber-900/20'}
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {loadingStep}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Concept
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col justify-center min-h-[500px]">
          <AnimatePresence mode="wait">
            {!concept ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full min-h-[500px] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-600 bg-white/[0.02]"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 opacity-20" />
                </div>
                <p>Your unique creation awaits...</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="relative aspect-square">
                   <img 
                    src={concept.imageUrl} 
                    alt={concept.idea.title} 
                    className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                   
                   <div className="absolute bottom-6 left-6 right-6">
                     <span className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full uppercase mb-3 inline-block">
                       {concept.idea.difficulty}
                     </span>
                     <h2 className="text-3xl font-serif text-white mb-2">{concept.idea.title}</h2>
                   </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Concept Description</h3>
                    <p className="text-gray-300 leading-relaxed font-light">{concept.idea.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Required Materials</h3>
                    <div className="flex flex-wrap gap-2">
                      {concept.idea.materials.map((mat, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-sm text-gray-400">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setConcept(null)}
                    className="w-full py-3 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Workshop;