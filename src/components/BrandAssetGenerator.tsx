"use client";

import exp from "constants";
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
console.log(description)
console.log(platforms)
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Brand Asset Generator</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a brief description of your brand"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Target Audience</label>
        <input
          type="text"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Who is your audience?"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleGenerateName}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          Generate Brand Name
        </button>
        {aiSuggestedName && (
          <p className="mt-2 text-gray-700">
            AI Suggested Name: <strong>{aiSuggestedName}</strong>
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Custom Brand Name (optional)</label>
        <input
          type="text"
          value={customBrandName}
          onChange={(e) => setCustomBrandName(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your custom brand name (optional)"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Platforms</label>
        <select
          multiple
          value={platforms}
          onChange={(e) => setPlatforms(Array.from(e.target.selectedOptions, (o) => o.value))}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Youtube">YouTube</option>
          <option value="Twitter">Twitter</option>
          <option value="Instagram">Instagram</option>
        </select>
      </div>

      <button
        onClick={handleGenerateAssets}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        disabled={loading || (!customBrandName && !aiSuggestedName)}
      >
        Generate Assets
      </button>

      {assets && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Generated Assets</h2>
          {Object.entries(assets).map(([platform, { logo, banner }]) => (
            <div key={platform} className="mb-4">
              <h3 className="text-lg font-semibold">{platform}</h3>
              <img src={logo} alt={`${platform} Logo`} className="mb-2 rounded" />
              {banner && <img src={banner} alt={`${platform} Banner`} className="rounded" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

