import Together from "together-ai";
import { ImageGenerator } from "./imageGenerator";
import { Platform, BrandInfo, GeneratedAssets, PlatformConfig } from "./types";

export class BrandAssetGenerator {
  private readonly imageGenerator: ImageGenerator;
  private readonly llmClient: Together;

  private readonly baseStyleGuidelines = `
  Important constraints:
    - Do not include any platform-specific UI elements or icons
    - Create only the brand artwork itself
    - Use clean, professional design
    - Ensure high contrast and readability
    - Avoid text unless it's part of the logo
    - Create unique, distinctive imagery
    - Use bold, memorable visual elements
  `;

  private readonly platformConfigs: Record<Platform, PlatformConfig> = {
    Youtube: {
      requiresBanner: true,
      logoPromptEnhancer: (info: BrandInfo) => `
      Design a professional brand logo for "${info.brandName}":
      
      Context:
      ${info.description}
      ${info.targetAudience ? `Target Audience: ${info.targetAudience}` : ''}
      
      Requirements:
      - Design must work well as a circular profile picture
      - Create a simple, iconic design that's recognizable at small sizes
      - Avoid any YouTube-specific elements (no play buttons, video icons, etc.)
      - Focus on creating a standalone brand mark
      - Use colors that reflect the brand's personality
      
      ${this.baseStyleGuidelines}
      
      Additional brand personality notes:
      ${this.extractBrandPersonality(info.description)}
    `,
      bannerPromptEnhancer: (info: BrandInfo) => `
      Create a professional brand banner for "${info.brandName}":
      
      Context:
      ${info.description}
      ${info.targetAudience ? `Target Audience: ${info.targetAudience}` : ''}
      
       Technical Requirements:
        - Create a wide banner format (2560x1440 pixels)
        - Design with safe zones in mind (70% of content in center)
        - Ensure readability at different screen sizes
        - Account for mobile viewing (important elements visible in center)
        
        Style Requirements:
        - Extend the logo's visual language to banner format
        - Create visual hierarchy with depth and layering
        - Use consistent color palette from logo
        - Include subtle patterns or textures that reflect brand story
        - Maintain clear negative space for overlay elements
      
      ${this.baseStyleGuidelines}
      
      Additional brand personality notes:
      ${this.extractBrandPersonality(info.description)}
    `,
    },
    Twitter: {
      requiresBanner: true,
      logoPromptEnhancer: (info: BrandInfo) => `
      Design a professional brand logo for "${info.brandName}":
      
      Context:
      ${info.description}
      ${info.targetAudience ? `Target Audience: ${info.targetAudience}` : ''}
      
      Requirements:
      - Create a bold, distinctive profile picture
      - Design must be instantly recognizable at small sizes
      - Avoid any Twitter/X-specific elements
      - Focus on creating a standalone brand mark
      - Use strong, confident visual elements
      
      ${this.baseStyleGuidelines}
      
      Additional brand personality notes:
      ${this.extractBrandPersonality(info.description)}
    `,
      bannerPromptEnhancer: (info: BrandInfo) => `
      Create a professional brand banner for "${info.brandName}":
      
      Context:
      ${info.description}
      ${info.targetAudience ? `Target Audience: ${info.targetAudience}` : ''}
      
      Requirements:
      - Design a wide header image
      - Create visual harmony with the profile picture
      - Avoid any Twitter/X-specific elements or interfaces
      - No social media buttons or overlays
      - Include subtle brand elements or patterns
      - Allow for text overlay visibility
      
      ${this.baseStyleGuidelines}
      
      Additional brand personality notes:
      ${this.extractBrandPersonality(info.description)}
    `,
    },
    Instagram: {
      requiresBanner: false,
      logoPromptEnhancer: (info: BrandInfo) => `
      Design a professional brand logo for "${info.brandName}":
      
      Context:
      ${info.description}
      ${info.targetAudience ? `Target Audience: ${info.targetAudience}` : ''}
      
      Requirements:
      - Create a visually striking profile picture
      - Design must work in Instagram's circular format
      - Avoid any Instagram-specific elements
      - Focus on creating a standalone brand mark
      - Use aesthetically pleasing visual elements
      
      ${this.baseStyleGuidelines}
      
      Additional brand personality notes:
      ${this.extractBrandPersonality(info.description)}
    `,
      bannerPromptEnhancer: () => '',
    },
  };

  private extractBrandPersonality(description: string): string {
    const prompt = `
      Analyze this business description and extract 3-4 key brand personality traits
      that should influence the visual design. Be specific and concise.
      
      Description: ${description}
      
      Format your response as a comma-separated list of traits only.
    `;

    return "Professional, Modern, Trustworthy";
  }

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('api key is required');
    }
    this.imageGenerator = new ImageGenerator(apiKey);
    this.llmClient = new Together({ apiKey });
  }

  private async generateBrandName(description: string, targetAudience?: string): Promise<string> {
    const prompt = `
      Generate a unique and memorable brand name based on the following criteria:
      
      Business Description: ${description}
      ${targetAudience ? `Target Audience: ${targetAudience}` : ''}
      
      Requirements:
      - Name should be 1-2 words maximum
      - Must be easy to pronounce and spell
      - Should be memorable and distinctive
      - Avoid generic terms
      - Must not include platform-specific terms (e.g., "tube", "gram", etc.)
      - Should work across all social media platforms
      - Must not infringe on well-known brands
      
      Return only the brand name, nothing else.
    `;

    const response = await this.llmClient.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/Llama-Vision-Free",
      temperature: 0.9,
      max_tokens: 50,
    });

    const messageContent = response.choices?.[0]?.message?.content;
    if (!messageContent) {
      throw new Error('Failed to generate brand name: no response from AI model');
    }

    return messageContent.trim();
  }

  async generatePlatformAssets(platform: Platform, brandInfo: BrandInfo): Promise<GeneratedAssets> {
    const config = this.platformConfigs[platform];
    const logoPrompt = config.logoPromptEnhancer(brandInfo);

    const maxAttempts = 3;
    let logo: any;
    let attempt = 0;

    while (!logo && attempt < maxAttempts) {
      try {
        logo = await this.imageGenerator.generateImage(logoPrompt, "logo");
      } catch (error) {
        attempt++;
        if (attempt === maxAttempts) {
          throw new Error(`Failed to generate logo after ${maxAttempts} attempts`);
        }
      }
    }

    let banner;
    if (config.requiresBanner) {
      const bannerPrompt = config.bannerPromptEnhancer(brandInfo);
      attempt = 0;

      while (!banner && attempt < maxAttempts) {
        try {
          banner = await this.imageGenerator.generateImage(bannerPrompt, "banner");
        } catch (error) {
          attempt++;
          if (attempt === maxAttempts) {
            throw new Error(`Failed to generate banner after ${maxAttempts} attempts`);
          }
        }
      }
    }

    return { logo, banner };
  }

  async generateBrandAssets(
    description: string,
    platforms: Platform[],
    targetAudience?: string,
    customBrandName?: string
  ): Promise<{ brandName: string; assets: Record<Platform, GeneratedAssets> }> {
    const brandName = customBrandName || (await this.generateBrandName(description, targetAudience));
    const brandInfo: BrandInfo = {
      description,
      targetAudience,
      brandName,
    };

    const results: Partial<Record<Platform, GeneratedAssets>> = {};

    for (const platform of platforms) {
      results[platform] = await this.generatePlatformAssets(platform, brandInfo);
    }

    return {
      brandName,
      assets: results as Record<Platform, GeneratedAssets>,
    };
  }
}
