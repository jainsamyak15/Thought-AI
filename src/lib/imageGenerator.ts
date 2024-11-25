import Together from "together-ai";
import { ConfigurationError, APIError } from "./errors";
import { DEFAULT_CONFIG, BANNER_DIMENSIONS } from "./config";
import { GenerationResult } from "./types";

export class ImageGenerator {
  private readonly together: Together;
  private readonly config: typeof DEFAULT_CONFIG;

  constructor(apiKey: string, customConfig?: Partial<typeof DEFAULT_CONFIG>) {
    if (!apiKey) {
      throw new ConfigurationError("api key is required");
    }

    this.together = new Together({ apiKey });
    this.config = { ...DEFAULT_CONFIG, ...customConfig };
  }

  // main function to generate image based on type and enhanced prompt
  public async generateImage(prompt: string, type: 'logo' | 'banner'): Promise<string> {
    try {
      const results = await this.callAPI(prompt, type);

      if (results.length === 0 || !results[0].url) {
        throw new APIError("no valid image URL in API response");
      }
      return results[0].url;
    } catch (error: any) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('failed to generate image', error);
    }
  }

  // function to call together api for image generation
  public async callAPI(prompt: string, type: "logo" | "banner"): Promise<GenerationResult[]> {
    try {
      const config = this.config[type];
      if (!config) {
        throw new ConfigurationError(`Invalid type '${type}' for image generation.`);
      }

      const response = await this.together.images.create({
        model: config.model,
        prompt,
        steps: config.steps,
        seed: this.getRandomSeed(),
        n: config.n,
        width: config.width,
        height: config.height,
      });

      this.validateAPIResponse(response);

      return response.data.map((item: any, index: number) => ({
        index,
        url: item.url,
        timings: item.timings,
      }));
    } catch (error: any) {
      throw new APIError('api call failed', error);
    }
  }

  // validate api response structure
  private validateAPIResponse(response: any): void {
    if (!response?.data?.length) {
      throw new APIError('invalid API response structure');
    }
  }

  // generate a random seed for consistent image variation
  private getRandomSeed(): number {
    return Math.floor(Math.random() * 1000000);
  }
}