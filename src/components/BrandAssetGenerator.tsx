"use client";

import { useState } from "react";

interface Asset {
  logo: string;
  banner?: string;
}

type Assets = Record<string, Asset>;

export default function BrandAssetGenerator() {
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [customBrandName, setCustomBrandName] = useState("");
  const [aiSuggestedName, setAiSuggestedName] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [assets, setAssets] = useState<Assets | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateName = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/brand-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, targetAudience, platforms }),
      });

      const data = await response.json();
      setAiSuggestedName(data.brandName || "No suggestion available");
    } catch (error) {
      console.error("Error generating brand name:", error);
      setAiSuggestedName("Error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/brand-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          platforms,
          targetAudience,
          customBrandName: customBrandName || aiSuggestedName,
        }),
      });

      const data = await response.json();
      setAssets(data.assets);
    } catch (error) {
      console.error("Error generating assets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-orange-400 p-6">
      <div className="max-w-4xl mx-auto p-8 bg-black border border-orange-500 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Brand Asset Generator
        </h1>
        <p className="text-center mb-6 text-orange-300">
          Create stylish logos, banners, and more for your brand effortlessly.
        </p>

        {/* Description Input */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Brand Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Describe your brand in a few words..."
          />
        </div>

        {/* Target Audience Input */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Target Audience</label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Who is your target audience?"
          />
        </div>

        {/* Platforms Selection */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Select Platform</label>
          <select
            value={platforms[0] || ""} // Use the first selected platform or empty
            onChange={(e) => setPlatforms([e.target.value])} // Update state with single selection
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" disabled>
              Select a platform
            </option>
            <option value="Youtube">YouTube</option>
            <option value="Twitter">Twitter</option>
            <option value="Instagram">Instagram</option>
          </select>
        </div>

        {/* Generate Brand Name */}
        <div className="mb-6">
          <button
            onClick={handleGenerateName}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold ${
              loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-black"
            }`}
          >
            {loading ? "Generating..." : "Generate Brand Name"}
          </button>
          {aiSuggestedName && (
            <p className="mt-4 text-center text-lg">
              AI Suggested Name:{" "}
              <span className="font-bold text-orange-300">
                {aiSuggestedName}
              </span>
            </p>
          )}
        </div>

        {/* Custom Brand Name Input */}
        <div className="mb-6">
          <label className="block text-lg mb-2">
            Custom Brand Name (optional)
          </label>
          <input
            type="text"
            value={customBrandName}
            onChange={(e) => setCustomBrandName(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter your custom brand name"
          />
        </div>

        {/* Generate Assets */}
        <div>
          <button
            onClick={handleGenerateAssets}
            disabled={loading || (!customBrandName && !aiSuggestedName)}
            className={`w-full py-3 rounded-lg font-semibold ${
              loading || (!customBrandName && !aiSuggestedName)
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-black"
            }`}
          >
            {loading ? "Generating Assets..." : "Generate Assets"}
          </button>
        </div>

        {/* Display Generated Assets */}
        {assets && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-4">
              Generated Assets
            </h2>
            <div className="space-y-6">
              {Object.entries(assets).map(([platform, { logo, banner }]) => (
                <div
                  key={platform}
                  className="p-4 bg-gray-800 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold mb-2">{platform}</h3>
                  <img
                    src={logo}
                    alt={`${platform} Logo`}
                    className="mb-4 rounded-md"
                  />
                  {banner && (
                    <img
                      src={banner}
                      alt={`${platform} Banner`}
                      className="rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
