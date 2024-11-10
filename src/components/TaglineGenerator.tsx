import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader, Copy, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import CreditDisplay from "./CreditDisplay";

const TaglineGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedTaglines, setGeneratedTaglines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const TAGLINE_COST = 10; // $0.10 in cents

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please sign in to generate taglines");
        setIsLoading(false);
        return;
      }

      const { data: creditsData } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (
        !creditsData ||
        creditsData.total_credits - creditsData.used_credits < TAGLINE_COST
      ) {
        alert("Insufficient credits to generate taglines");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/generate-tagline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId: user.id }),
      });

      if (!response.ok) throw new Error("Failed to generate taglines");

      const data = await response.json();
      const taglines = data.tagline.split("\n").filter(Boolean);
      setGeneratedTaglines(taglines);

      // Update credits
      await supabase
        .from("user_credits")
        .update({ used_credits: creditsData.used_credits + TAGLINE_COST })
        .eq("user_id", user.id);

      // Store taglines
      for (const tagline of taglines) {
        await supabase.from("generated_taglines").insert([
          {
            user_id: user.id,
            tagline: tagline,
            prompt: prompt,
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate taglines. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (tagline: string, index: number) => {
    try {
      await navigator.clipboard.writeText(tagline);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
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
            Tagline Generator
          </h1>
          <p className="text-xl text-white italic">
            Create captivating taglines for your brand
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <CreditDisplay serviceCost={TAGLINE_COST} serviceType="tagline" />

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
                placeholder="Describe your brand or product..."
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
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#FF6500]/70 hover:bg-[#FF6500]/80 transform hover:scale-[1.02]"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" />
                  Generating...
                </span>
              ) : (
                "Generate Taglines"
              )}
            </button>
          </motion.form>

          {generatedTaglines.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-4"
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Your Generated Taglines
              </h2>
              {generatedTaglines.map((tagline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-medium">{tagline}</p>
                    <button
                      onClick={() => copyToClipboard(tagline, index)}
                      className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaglineGenerator;
