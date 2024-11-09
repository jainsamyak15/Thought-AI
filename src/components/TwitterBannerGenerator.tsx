import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Twitter, Download, Loader, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CreditDisplay from './CreditDisplay';
import { uploadImageToStorage } from '../utils/storage';

const TwitterBannerGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedBannerUrl, setGeneratedBannerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerCount, setBannerCount] = useState(0);
  const BANNER_COST = 30; // $0.30 in cents

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please sign in to generate banners');
        setIsLoading(false);
        return;
      }

      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!creditsData || (creditsData.total_credits - creditsData.used_credits) < BANNER_COST) {
        alert('Insufficient credits to generate banner');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/generate-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId: user.id }),
      });

      if (!response.ok) throw new Error('Failed to generate banner');

      const data = await response.json();
      
      // Upload to Supabase Storage
      const permanentUrl = await uploadImageToStorage(data.imageUrl, 'banner');
      
      setGeneratedBannerUrl(permanentUrl);
      setBannerCount(prev => prev + 1);

      // Update credits
      await supabase
        .from('user_credits')
        .update({ used_credits: creditsData.used_credits + BANNER_COST })
        .eq('user_id', user.id);

      // Store the generated image
      await supabase
        .from('generated_images')
        .insert([{
          user_id: user.id,
          image_url: permanentUrl,
          type: 'banner',
          prompt: prompt
        }]);

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate banner. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedBannerUrl) return;
    try {
      const response = await fetch(generatedBannerUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `banner_${bannerCount}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to download banner. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-4">
            Twitter Banner Generator
          </h1>
          <p className="text-xl text-gray-300">
            Create eye-catching banners for your Twitter profile
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <CreditDisplay serviceCost={BANNER_COST} serviceType="banner" />

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
                placeholder="Describe your perfect Twitter banner..."
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                required
              />
              <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transform hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" />
                  Generating...
                </span>
              ) : (
                'Generate Banner'
              )}
            </button>
          </motion.form>

          {generatedBannerUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-center mb-6">Your Generated Banner</h2>
              <div className="relative w-full aspect-[1500/500] mb-6">
                <Image
                  src={generatedBannerUrl}
                  alt="Generated Banner"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <button
                onClick={handleDownload}
                className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl font-semibold transition-colors flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Banner
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterBannerGenerator;