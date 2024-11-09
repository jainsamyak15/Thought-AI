import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Image, Twitter, MessageSquare, Palette, Zap } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI-Powered Design',
    description: 'Harness the power of artificial intelligence to create stunning visuals instantly.'
  },
  {
    icon: <Image className="w-6 h-6" />,
    title: 'Logo Generation',
    description: 'Create unique, professional logos tailored to your brand identity.'
  },
  {
    icon: <Twitter className="w-6 h-6" />,
    title: 'Twitter Banners',
    description: 'Design eye-catching social media banners that stand out.'
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Tagline Generator',
    description: 'Generate compelling taglines that capture your brand essence.'
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Brand Identity',
    description: 'Maintain consistent branding across all your visual assets.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Generation',
    description: 'Get professional results in seconds, not hours or days.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to create professional designs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
            >
              <div className="mb-4 text-purple-400 group-hover:text-purple-300 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;