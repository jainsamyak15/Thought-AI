import { NextApiRequest, NextApiResponse } from 'next';
import Together from 'together-ai';
import { enhanceBannerPrompt } from '../../utils/enhancePrompt';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    const enhancedPrompt = enhanceBannerPrompt(prompt);
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: enhancedPrompt,
      width: 1440,  // Slightly larger to account for potential cropping
      height: 576,
      steps: 4,    // Increased for better results
      n: 1,
      negative_prompt: "blur, pixelated, low quality, text overlap,Twitter logo, Facebook logo, social media logos, user interface, text, words, letters, watermark, signature, blurry, low quality"
    });

    const imageUrl = response.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating Twitter banner:', error);
    res.status(500).json({ message: 'Error generating Twitter banner' });
  }
}
