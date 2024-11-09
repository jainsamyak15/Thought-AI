import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import { cn } from "../utils/cn";
import { supabase } from "../lib/supabase";
import GeneratedLogos from "../components/GeneratedLogos";
import GridTrailEffect from "../components/GridTrailEffect";

const Home = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();
  }, []);

  const handleStartCreating = () => {
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#151515] text-white">
      <GridTrailEffect />
      {/* Background Grid */}
      {/* <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div> */}

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white text-transparent bg-clip-text">
              <Typewriter
                options={{
                  strings: [
                    "Create stunning designs",
                    "Generate unique logos",
                    "Design Twitter banners",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </h1>
            <p className="text-xl md:text-3xl italic text-white mb-8">
              Transform your ideas into stunning visuals with the power of AI
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6"
            >
              <button
                onClick={handleStartCreating}
                className="px-8 py-4 bg-[#FF6500]/80 rounded-full text-lg font-medium hover:opacity-90 transition-opacity w-full md:w-auto"
              >
                Start Creating
              </button>
              <button
                onClick={() =>
                  document
                    .querySelector("#features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-white/10 rounded-full text-lg font-medium hover:bg-white/20 transition-colors w-full md:w-auto"
              >
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <FloatingElement className="top-1/4 left-1/4" delay={0.5} />
        <FloatingElement className="top-1/3 right-1/4" delay={0.7} />
        <FloatingElement className="bottom-1/4 left-1/3" delay={0.9} />
      </section>

      {/* Features Marquee */}
      <div className="py-12 bg-[#FF6500]/70 overflow-hidden">
        <MarqueeContent />
      </div>

      {/* Main Sections */}
      <Features />
      <GeneratedLogos />
      {/* <Pricing /> */}
      <FAQ />
    </div>
  );
};

const FloatingElement = ({
  className,
  delay,
}: {
  className: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2,
      }}
      className={cn(
        "absolute w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 blur-sm",
        className
      )}
    />
  );
};

const MarqueeContent = () => {
  const features = [
    "AI-Powered Design",
    "Logo Generation",
    "Twitter Banners",
    "Brand Identity",
    "Custom Taglines",
    "Visual Content",
  ];

  return (
    <div className="relative flex overflow-x-hidden">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {/* Repeat features enough to ensure seamless looping */}
        {features.map((feature, index) => (
          <span
            key={index}
            className="mx-4 text-3xl font-bold text-white italic text-transparent bg-clip-text"
          >
            {feature}
          </span>
        ))}
        {/* Repeat the same features again for seamless looping */}
        {features.map((feature, index) => (
          <span
            key={index + features.length}
            className="mx-4 text-3xl font-bold text-white italic text-transparent bg-clip-text"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Home;
