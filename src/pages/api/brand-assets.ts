import { NextApiRequest, NextApiResponse } from "next";
import { BrandAssetGenerator } from "@/lib/brandAssetGenerator";
import { Platform } from "@/lib/types";

const API_KEY = process.env.TOGETHER_API_KEY;

if (!API_KEY) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const dummyData = {
        success: true,
        brandName: "TestBrand",
        assets: [
          { platform: "Youtube", asset: "Dummy asset for Youtube" },
          { platform: "Twitter", asset: "Dummy asset for Twitter" },
          { platform: "Instagram", asset: "Dummy asset for Instagram" },
        ],
      };
      return res.status(200).json(dummyData);
    }

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { description, platforms, targetAudience, customBrandName } = req.body;

    if (!description || !platforms || platforms.length === 0) {
      return res.status(400).json({
        message: "Invalid input: 'description' and 'platforms' are required",
      });
    }

    const validPlatforms: Platform[] = ["Youtube", "Twitter", "Instagram"];
    const filteredPlatforms = platforms.filter((platform: string): platform is Platform =>
      validPlatforms.includes(platform as Platform)
    );

    if (filteredPlatforms.length === 0) {
      return res.status(400).json({ message: "No valid platforms provided" });
    }

    const generator = new BrandAssetGenerator(API_KEY as string);

    const { brandName, assets } = await generator.generateBrandAssets(
      description,
      filteredPlatforms,
      targetAudience,
      customBrandName
    );

    res.status(200).json({ success: true, brandName, assets });
  } catch (error: any) {
    console.error("Error generating brand assets:", error);
    res.status(500).json({
      message: "Failed to generate brand assets",
      error: error.message,
    });
  }
}
