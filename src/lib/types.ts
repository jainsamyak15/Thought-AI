// types for brand information, assets generation and platform config and generation result

export interface GenerationResult {
    index: number;
    url: string;
  }
  
  export type Platform = "Youtube" | "Twitter" | "Instagram";
  
  export interface BrandInfo {
    description: string;
    targetAudience?: string;
    brandName: string;
  }
  
  export interface GeneratedAssets {
    logo: string;
    banner?: string;
  }
  
  export interface PlatformConfig {
    requiresBanner: boolean;
    logoPromptEnhancer: (info: BrandInfo) => string;
    bannerPromptEnhancer: (info: BrandInfo) => string;
  }