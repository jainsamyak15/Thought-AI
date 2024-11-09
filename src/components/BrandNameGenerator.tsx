import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader, Copy, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CreditDisplay from './CreditDisplay';

const MAIN_CATEGORIES = [
  { id: 'technology', name: 'Technology', subcategories: ['edtech', 'fintech', 'healthtech', 'ai', 'saas', 'iot', 'cybersecurity', 'blockchain'] },
  { id: 'commerce', name: 'Commerce & Retail', subcategories: ['ecommerce', 'dtc', 'retail', 'marketplace'] },
  { id: 'business', name: 'Business & Enterprise', subcategories: ['marketing', 'hr', 'crm', 'analytics'] },
  { id: 'entertainment', name: 'Entertainment & Media', subcategories: ['gaming', 'streaming', 'social', 'content'] },
  { id: 'lifestyle', name: 'Lifestyle & Consumer', subcategories: ['wellness', 'fitness', 'food', 'travel'] },
  { id: 'sustainability', name: 'Sustainability & Impact', subcategories: ['cleantech', 'greentech', 'agritech', 'impact'] },
  { id: 'emerging', name: 'Emerging Tech', subcategories: ['robotics', 'ar', 'space', '3dprinting'] },
];

const CATEGORIES = [
  { id: 'edtech', name: 'EdTech', description: 'Educational Technology' },
  { id: 'fintech', name: 'FinTech', description: 'Financial Technology' },
  { id: 'healthtech', name: 'HealthTech', description: 'Healthcare Technology' },
  { id: 'ai', name: 'AI/ML', description: 'Artificial Intelligence' },
  { id: 'saas', name: 'SaaS', description: 'Software as a Service' },
  { id: 'iot', name: 'IoT', description: 'Internet of Things' },
  { id: 'cybersecurity', name: 'CyberSec', description: 'Cybersecurity Solutions' },
  { id: 'blockchain', name: 'Blockchain', description: 'Blockchain & Crypto' },
  { id: 'ecommerce', name: 'E-Commerce', description: 'Online Retail' },
  { id: 'dtc', name: 'D2C', description: 'Direct to Consumer' },
  { id: 'retail', name: 'Retail Tech', description: 'Retail Technology' },
  { id: 'marketplace', name: 'Marketplace', description: 'Online Marketplaces' },
  { id: 'marketing', name: 'Marketing', description: 'Digital Marketing' },
  { id: 'hr', name: 'HR Tech', description: 'Human Resources Tech' },
  { id: 'crm', name: 'CRM', description: 'Customer Relationship' },
  { id: 'analytics', name: 'Analytics', description: 'Business Intelligence' },
  { id: 'gaming', name: 'Gaming', description: 'Games & Entertainment' },
  { id: 'streaming', name: 'Streaming', description: 'Media Streaming' },
  { id: 'social', name: 'Social', description: 'Social Media' },
  { id: 'content', name: 'Content', description: 'Content Creation' },
  { id: 'wellness', name: 'Wellness', description: 'Health & Wellness' },
  { id: 'fitness', name: 'Fitness', description: 'Fitness & Sports' },
  { id: 'food', name: 'FoodTech', description: 'Food Technology' },
  { id: 'travel', name: 'Travel', description: 'Travel & Tourism' },
  { id: 'cleantech', name: 'CleanTech', description: 'Clean Technology' },
  { id: 'greentech', name: 'GreenTech', description: 'Sustainable Solutions' },
  { id: 'agritech', name: 'AgriTech', description: 'Agricultural Tech' },
  { id: 'impact', name: 'Impact', description: 'Social Impact' },
  { id: 'robotics', name: 'Robotics', description: 'Robotics & Automation' },
  { id: 'ar', name: 'AR/VR', description: 'Augmented & Virtual Reality' },
  { id: 'space', name: 'SpaceTech', description: 'Space Technology' },
  { id: '3dprinting', name: '3D Print', description: '3D Printing Tech' },
];

const BrandNameGenerator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [mainCategory, setMainCategory] = useState<string | null>(null); // Stores selected main category
  const [selectedCategory, setSelectedCategory] = useState(''); // Stores selected subcategory
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const BRAND_NAME_COST = 15; // $0.15 in cents

  const handleMainCategorySelect = (categoryId: string) => {
    setMainCategory(categoryId); // Sets the main category and triggers subcategory view
    setSelectedCategory(''); // Reset subcategory selection
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please sign in to generate brand names');
        setIsLoading(false);
        return;
      }

      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!creditsData || (creditsData.total_credits - creditsData.used_credits) < BRAND_NAME_COST) {
        alert('Insufficient credits to generate brand names');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/generate-brand-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description, 
          category: selectedCategory,
          userId: user.id 
        }),
      });

      if (!response.ok) throw new Error('Failed to generate brand names');

      const data = await response.json();
      const names = data.names;
      setGeneratedNames(names);

      // Update credits
      await supabase
        .from('user_credits')
        .update({ used_credits: creditsData.used_credits + BRAND_NAME_COST })
        .eq('user_id', user.id);

      // Store generated names
      await supabase
        .from('generated_brand_names')
        .insert(
          names.map((name: string) => ({
            user_id: user.id,
            name: name,
            description: description,
            category: selectedCategory
          }))
        );

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate brand names. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (name: string, index: number) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
            Brand Name Generator
          </h1>
          <p className="text-xl text-gray-300">
            Create unique and memorable names for your startup
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <CreditDisplay serviceCost={BRAND_NAME_COST} serviceType="logo" />

          {/* Main Category Selection */}
          {!mainCategory ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {MAIN_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleMainCategorySelect(category.id)}
                  className="p-4 rounded-xl border transition-all border-white/10 hover:border-purple-500/50"
                >
                  <h3 className="font-medium mb-1">{category.name}</h3>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setMainCategory(null)}
                className="mb-4 text-sm text-gray-400 hover:text-white"
              >
                ← Back to Main Categories
              </button>

              {/* Subcategory Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CATEGORIES.filter((cat) => MAIN_CATEGORIES.find(mc => mc.id === mainCategory)?.subcategories.includes(cat.id))
                  .map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-xl border transition-all ${
                        selectedCategory === category.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/10 hover:border-purple-500/50'
                      }`}
                    >
                      <h3 className="font-medium mb-1">{category.name}</h3>
                      <p className="text-xs text-gray-400">{category.description}</p>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Form for description */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6 mt-6"
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your startup idea..."
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition-all duration-300 min-h-[120px]"
              required
            />

            <button
              type="submit"
              disabled={isLoading || !selectedCategory}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isLoading || !selectedCategory
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
                'Generate Brand Names'
              )}
            </button>
          </motion.form>

          {/* Generated names output */}
          {generatedNames.length > 0 && (
            <div className="mt-8 space-y-4">
              {generatedNames.map((name, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{name}</h3>
                    <button
                      onClick={() => copyToClipboard(name, index)}
                      className="text-purple-500 hover:text-purple-300"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Copy className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandNameGenerator;
