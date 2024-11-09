import { NextApiRequest, NextApiResponse } from 'next';
import Together from 'together-ai';
import { supabase } from '../../lib/supabase';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - Please sign in' });
    }

    const enhancedPrompt = `Create an exceptional, premium quality logo design for: ${prompt}

Key Design Requirements:
- Ultra-high resolution, photorealistic quality where applicable
- Minimalist and sophisticated design approach
- Perfect composition following the golden ratio
- Exceptional attention to detail and craftsmanship
- Professional color harmony using modern color theory
- Subtle gradients and professional color transitions
- Masterful use of negative space
- Crystal clear edges and perfect symmetry
- Elegant shadows and highlights
- Premium finish with perfect balance

Style Specifications:
- Modern, timeless, and professional
- Clean lines and geometric precision
- Luxurious and high-end aesthetic
- Corporate-ready and scalable
- Perfect for both digital and print media
- Exceptional visual hierarchy
- Striking visual impact
- Premium brand positioning
- Industry-leading quality standards
- Innovative and unique approach

Technical Parameters:
- Ultra-high resolution output
- Perfect vector-like quality
- Crisp edges and clean lines
- Professional color calibration
- Perfect aspect ratio and scaling
- Optimal contrast and saturation
- High-fidelity details
- Premium rendering quality
- Professional post-processing
- Industry-standard output format

Negative prompt: text, words, letters, watermark, signature, low quality, blurry, pixelated, amateur, unprofessional, busy, cluttered, childish, cartoon, sketchy, hand-drawn, distorted, unbalanced, asymmetrical, poor composition, basic, generic, template-like, stock-image-like, dated, old-fashioned, trendy, gimmicky, complex, overwhelming, noisy, messy, unrefined`;

    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: enhancedPrompt,
      width: 1024,
      height: 1024,
      steps: 4,  // Increased for better quality
      n: 1,
      seed: Math.floor(Math.random() * 1000000),
      negative_prompt: "text, words, letters, watermark, signature, low quality, blurry, amateur, unprofessional, busy, cluttered, childish, cartoon, sketchy, hand-drawn, distorted, unbalanced, asymmetrical, poor composition",
      cfg_scale: 12,  // Increased for stronger adherence to prompt
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ message: 'Error: No image URL returned' });
    }

    res.status(200).json({ imageUrl });

  } catch (error) {
    console.error('Error generating logo:', error);
    res.status(500).json({ message: 'Error generating logo' });
  }
}