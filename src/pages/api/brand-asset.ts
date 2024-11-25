import { NextRequest, NextResponse } from "next/server";
import { BrandAssetGenerator } from "../../lib/brandAssetGenerator";
import { Platform } from "../../lib/types";

const API_KEY = process.env.TOGETHER_API_KEY ?? "default-api-key";


if (!API_KEY) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      description = "",
      platforms = [],
      targetAudience = "",
      customBrandName = "",
    } = body;

    if (!description || platforms.length === 0) {
      return NextResponse.json(
        { error: "Invalid input: 'description' and 'platforms' are required" },
        { status: 400 }
      );
    }

    const validPlatforms: Platform[] = ["Youtube", "Twitter", "Instagram"];

    const filteredPlatforms = platforms
      .filter((platform: string): platform is Platform =>
        validPlatforms.includes(platform as Platform)
      );

    if (filteredPlatforms.length === 0) {
      return NextResponse.json(
        { error: "No valid platforms provided" },
        { status: 400 }
      );
    }

    const generator = new BrandAssetGenerator(API_KEY);
    const { brandName, assets } = await generator.generateBrandAssets(
      description,
      filteredPlatforms,
      targetAudience,
      customBrandName
    );

    return NextResponse.json({ success: true, brandName, assets });
  } catch (error: any) {
    console.error("Error in brand-asset API:", error);
    return NextResponse.json(
      { error: "Failed to generate brand assets", details: error.message },
      { status: 500 }
    );
  }
}