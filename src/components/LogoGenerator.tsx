import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Download, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CreditDisplay from './CreditDisplay';
import { uploadImageToStorage } from '../utils/storage';

const STYLE_PRESETS = [
  { id: 'minimalist', name: 'Minimalist', description: 'Clean, simple, and modern designs' },
  { id: 'vintage', name: 'Vintage', description: 'Classic, retro-inspired aesthetics' },
  { id: 'futuristic', name: 'Futuristic', description: 'Modern, tech-forward designs' },
  { id: 'organic', name: 'Organic', description: 'Natural, flowing shapes and forms' },
  { id: 'geometric', name: 'Geometric', description: 'Bold shapes and mathematical precision' },
  { id: 'abstract', name: 'Abstract', description: 'Creative, non-representational designs' }
];

const COLOR_SCHEMES = [
  { id: 'monochrome', name: 'Monochrome', colors: ['#000000', '#FFFFFF'] },
  { id: 'warm', name: 'Warm', colors: ['#FF6B6B', '#FFA07A', '#FFD700'] },
  { id: 'cool', name: 'Cool', colors: ['#4A90E2', '#67B8C5', '#A0D8EF'] },
  { id: 'earth', name: 'Earth', colors: ['#8B4513', '#DAA520', '#228B22'] },
  { id: 'pastel', name: 'Pastel', colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF'] }
];

const LogoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedColors, setSelectedColors] = useState('');
  const [generatedLogoUrl, setGeneratedLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoCount, setLogoCount] = useState(0);
  const LOGO_COST = 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please sign in to generate logos');
        setIsLoading(false);
        return;
      }

      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!creditsData || (creditsData.total_credits - creditsData.used_credits) < LOGO_COST) {
        alert('Insufficient credits to generate logo');
        setIsLoading(false);
        return;
      }

      const enhancedPrompt = `${prompt}${
        selectedStyle ? ` in ${selectedStyle} style` : ''
      }${
        selectedColors ? ` using ${selectedColors} color scheme` : ''
      }`;

      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: enhancedPrompt, 
          userId: user.id,
          style: selectedStyle,
          colorScheme: selectedColors
        }),
      });

      if (!response.ok) throw new Error('Failed to generate logo');

      const data = await response.json();
      
      // Upload to Supabase Storage
      const permanentUrl = await uploadImageToStorage(data.imageUrl, 'logo');
      
      setGeneratedLogoUrl(permanentUrl);
      setLogoCount(prev => prev + 1);

      // Update credits
      await supabase
        .from('user_credits')
        .update({ used_credits: creditsData.used_credits + LOGO_COST })
        .eq('user_id', user.id);

      // Store the generated image
      await supabase
        .from('generated_images')
        .insert([
          {
            user_id: user.id,
            image_url: permanentUrl,
            type: 'logo',
            prompt: enhancedPrompt
          }
        ]);

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate logo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (url: string, index: number = 0) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `logo_${logoCount}_${index}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to download logo. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#151515] rounded-[17px] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white text-transparent bg-clip-text mb-4">
            AI Logo Generator
          </h1>
          <p className="text-xl text-white italic">
            Transform your ideas into stunning logos with AI
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <CreditDisplay serviceCost={LOGO_COST} serviceType="logo" />

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream logo..."
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                required
              />
              <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            </div>

            {/* Style Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 ${
                    selectedStyle === style.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/10 hover:border-purple-500/50'
                  }`}
                >
                  <h3 className="font-medium mb-1">{style.name}</h3>
                  <p className="text-xs text-gray-400">{style.description}</p>
                </button>
              ))}
            </div>

            {/* Color Schemes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {COLOR_SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  type="button"
                  onClick={() => setSelectedColors(scheme.id)}
                  className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 ${
                    selectedColors === scheme.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/10 hover:border-purple-500/50'
                  }`}
                >
                  <h3 className="font-medium mb-2">{scheme.name}</h3>
                  <div className="flex justify-center space-x-2">
                    {scheme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#FF6500]/70 hover:bg-[#FF6500]/80 transform hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" />
                  Generating...
                </span>
              ) : (
                'Generate Logo'
              )}
            </button>
          </motion.form>

          {generatedLogoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-8"
            >
              {/* Main Logo */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Your Generated Logo</h2>
                <div className="relative aspect-square max-w-md mx-auto mb-6">
                  <Image
                    src={generatedLogoUrl}
                    alt="Generated Logo"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <button
                  onClick={() => handleDownload(generatedLogoUrl)}
                  className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl font-semibold transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Logo
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoGenerator;