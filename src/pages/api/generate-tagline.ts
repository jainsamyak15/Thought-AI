import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { enhanceTaglinePrompt } from '../../utils/enhancePrompt';
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    const enhancedPrompt = enhanceTaglinePrompt(prompt);

    // Initialize Gemini Pro model with optimal parameters
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.85,
        topK: 50,
        topP: 0.95,
        maxOutputTokens: 200,
        stopSequences: ["Human:", "Assistant:"]
      },
    });

    // Generate content
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const tagline = response.text().trim();

    // Return the generated tagline
    res.status(200).json({ tagline });
  } catch (error) {
    console.error('Error generating tagline:', error);
    res.status(500).json({ message: 'Error generating tagline' });
  }
}

