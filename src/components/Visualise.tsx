import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  ArrowDownTrayIcon,
  ChartBarIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

interface GeneratedImage {
  id: string;
  created_at: string;
  image_url: string;
  type: "logo" | "banner";
  prompt: string;
}

interface GeneratedTagline {
  id: string;
  created_at: string;
  tagline: string;
  prompt: string;
}

interface UserCredits {
  total_credits: number;
  used_credits: number;
}

const Visualise: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [taglines, setTaglines] = useState<GeneratedTagline[]>([]);
  const [credits, setCredits] = useState<UserCredits>({
    total_credits: 0,
    used_credits: 0,
  });
  const [filteredImages, setFilteredImages] = useState(images);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser) {
          // Initialize credits if they don't exist
          const { data: existingCredits, error: selectError } = await supabase
            .from("user_credits")
            .select("*")
            .eq("user_id", currentUser.id)
            .single();

          if (!existingCredits || selectError) {
            const { data: newCredits, error: insertError } = await supabase
              .from("user_credits")
              .upsert(
                [
                  {
                    user_id: currentUser.id,
                    total_credits: 500,
                    used_credits: 0,
                  },
                ],
                {
                  onConflict: "user_id",
                }
              )
              .select()
              .single();

            if (!insertError && newCredits) {
              setCredits(newCredits);
            }
          } else {
            setCredits(existingCredits);
          }

          // Fetch images and taglines
          const { data: imageData } = await supabase
            .from("generated_images")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false });
          setImages(imageData || []);
          setFilteredImages(imageData || []);

          const { data: taglineData } = await supabase
            .from("generated_taglines")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false });
          setTaglines(taglineData || []);
        }
      } catch (error) {
        console.error("Error initializing user data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUserData();

    // Set up real-time subscription for credits
    const channel = supabase
      .channel("credit_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_credits",
        },
        (payload) => {
          setCredits(payload.new as UserCredits);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const remainingCredits = credits.total_credits - credits.used_credits;
  const remainingDollars = (remainingCredits / 100).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-4xl font-bold text-white mb-4">
          Please sign in to view your profile
        </h2>
      </div>
    );
  }

  const handleAllImages = () => {
    setFilteredImages(images);
  };

  const handleLogos = () => {
    setFilteredImages(images.filter((image) => image.type === "logo"));
  };

  const handleBanners = () => {
    setFilteredImages(images.filter((image) => image.type === "banner"));
  };

  const handleVisualise = (image: GeneratedImage) => {
    if (image.type === "banner") {
      router.push({
        pathname: "/billboard",
        query: { imageUrl: image.image_url },
      });
    } else if (image.type === "logo") {
      router.push(`/tshirt`);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 text-white">
      <button
        onClick={() => handleAllImages()}
        className="flex items-center space-x-3 px-4 py-3 mt-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
      >
        All Images
      </button>

      <button
        onClick={handleLogos}
        className="flex items-center space-x-3 px-4 py-3 mt-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
      >
        Logos
      </button>

      <button
        onClick={handleBanners}
        className="flex items-center space-x-3 px-4 py-3 mt-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
      >
        Banners
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Generated Content */}
        <div className="space-y-12">
          {/* Images Section */}
          {filteredImages.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-6">
                Your Designs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={image.image_url}
                        alt={`Generated ${image.type}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">
                        Prompt: {image.prompt}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Generated:{" "}
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleVisualise(image)}
                        className="mt-4 inline-flex items-center bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        {image.type === "logo"
                          ? "See this on T-Shirt"
                          : "See this on Billboard"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualise;
