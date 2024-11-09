import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Star } from 'lucide-react';

interface Logo {
  id: string;
  image_url: string;
  created_at: string;
}

const GeneratedLogos: React.FC = () => {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const { data: files, error: storageError } = await supabase
          .storage
          .from('ai-generated-images')
          .list('logos', {
            limit: 5,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (storageError) {
          console.error('Error fetching from storage:', storageError);
          return;
        }

        const logoUrls = await Promise.all(
          files.map(async (file) => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('ai-generated-images')
              .getPublicUrl(`logos/${file.name}`);
            
            return {
              id: file.id,
              image_url: publicUrl,
              created_at: file.created_at
            };
          })
        );

        setLogos(logoUrls);
      } catch (error) {
        console.error('Error fetching logos:', error);
      }
    };

    fetchLogos();
  }, []);

  const duplicatedLogos = [...logos, ...logos];

  return (
    <section id="showcase" className="py-20 relative">
    <div className="relative py-32 overflow-hidden">
      {/* Background with gradient and noise */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30">

      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative inline-block"
        >
          <Star className="absolute -top-6 -left-6 w-8 h-8 text-yellow-400 animate-pulse" />
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Creative Showcase
          </h2>
          <Star className="absolute -bottom-6 -right-6 w-8 h-8 text-yellow-400 animate-pulse delay-300" />
        </motion.div>
        <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
          Witness the magic of AI-powered design through our latest masterpieces
        </p>
      </div>

      {/* Scrolling Box */}
      <div className="relative mx-auto w-full max-w-5xl h-[500px] overflow-hidden rounded-lg shadow-lg border border-gray-700 bg-gradient-to-b from-purple-800/50 to-pink-800/50 p-10">
        <div className="flex justify-center gap-16 -rotate-12 scale-110">
          {/* Left Column */}
          <div className="flex flex-col space-y-8 animate-marquee-diagonal">
            {duplicatedLogos.slice(0, duplicatedLogos.length / 2).map((logo, index) => (
              <motion.div
                key={`${logo.id}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src={logo.image_url}
                  alt="Generated Logo"
                  fill
                  className="object-cover filter group-hover:brightness-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    View Details
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-8 animate-marquee-diagonal-reverse pt-32">
            {duplicatedLogos.slice(duplicatedLogos.length / 2).map((logo, index) => (
              <motion.div
                key={`${logo.id}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src={logo.image_url}
                  alt="Generated Logo"
                  fill
                  className="object-cover filter group-hover:brightness-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    View Details
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default GeneratedLogos;
