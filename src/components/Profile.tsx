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

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [taglines, setTaglines] = useState<GeneratedTagline[]>([]);
  const [credits, setCredits] = useState<UserCredits>({
    total_credits: 0,
    used_credits: 0,
  });
  const [filteredImages, setFilteredImages] = useState(images);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-[#151515] rounded-[17px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#151515] rounded-[17px] flex flex-col items-center justify-center p-4">
        <h2 className="text-4xl font-bold text-white mb-4">
          Please sign in to view your profile
        </h2>
      </div>
    );
  }
  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `ai-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const handleAllImages = () => {
    setFilteredImages(images);
  };

  const handleLogos = () => {
    console.log(images.filter((image) => image.type === "logo"));
    setFilteredImages(images.filter((image) => image.type === "logo"));
  };

  const handleBanners = () => {
    setFilteredImages(images.filter((image) => image.type === "banner"));
  };

  return (
    <div className="min-h-screen bg-[#151515] rounded-[17px] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-[#FF6500]/70 backdrop-blur-xl border border-white/10 p-8 mb-12"
        >
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            {user.user_metadata?.avatar_url && (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full border-4 border-purple-500/50"
              />
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white text-transparent bg-clip-text mb-2">
                {user.user_metadata?.full_name || "Designer"}
              </h1>
              <p className="text-lg text-white italic">{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Credits Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {/* <StatsCard
            icon={<StarIcon className="w-8 h-8 text-yellow-500" />}
            title="Total Credits"
            value={`$${(credits.total_credits / 100).toFixed(2)}`}
            description="Your initial balance"
          /> */}
          {/* <StatsCard
            icon={<ChartBarIcon className="w-8 h-8 text-purple-500" />}
            title="Used Credits"
            value={`$${(credits.used_credits / 100).toFixed(2)}`}
            description="Credits spent on generations"
          /> */}
          <StatsCard
            icon={<SparklesIcon className="w-8 h-8 text-pink-500" />}
            title="Remaining Credits"
            value={`$${remainingDollars}`}
            description="Available for new generations"
          />
        </motion.div>

        {/* Generated Content */}
        <div className="space-y-12">
          {/* Taglines Section */}
          {taglines.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-6">
                Your Taglines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {taglines.map((tagline, index) => (
                  <motion.div
                    key={tagline.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <p className="text-xl font-medium mb-3">
                      {tagline.tagline}
                    </p>
                    <p className="text-sm text-gray-400">
                      Prompt: {tagline.prompt}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Generated on:{" "}
                      {new Date(tagline.created_at).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Images Section */}
          {images.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-6">
                Your Designs
              </h2>
              <div className="flex flex-row space-x-5 pb-4">
                <button
                  onClick={() => handleAllImages()}
                  className="flex items-center space-x-3 px-4 py-3 mt-4 rounded-xl bg-[#FF6500]/70 transition-colors"
                >
                  All Images
                </button>

                <button
                  onClick={handleLogos}
                  className="flex items-center space-x-3 px-4 py-3 mt-4 rounded-xl bg-[#FF6500]/70 transition-colors"
                >
                  Logos
                </button>

                <button
                  onClick={handleBanners}
                  className="flex items-center space-x-3 px-4 py-3 mt-4 rounded-xl bg-[#FF6500]/70 transition-colors"
                >
                  Banners
                </button>
              </div>
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
                                {new Date(
                                  image.created_at
                                ).toLocaleDateString()}
                              </p>
                              <button
                                onClick={() => handleDownload(image.image_url)}
                                className="mt-4 inline-flex items-center bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg transition-colors text-sm"
                              >
                                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                                Download
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
    <div className="flex items-center gap-4 mb-4">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
      {value}
    </p>
    <p className="text-sm text-gray-400 mt-2">{description}</p>
  </div>
);

export default Profile;
