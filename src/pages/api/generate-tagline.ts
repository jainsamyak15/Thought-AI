import { NextApiRequest, NextApiResponse } from 'next';
import Together from 'together-ai';
import { enhanceTaglinePrompt } from '../../utils/enhancePrompt';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    const enhancedPrompt = enhanceTaglinePrompt(prompt);
    const response = await together.chat.completions.create({
      messages: [{ role: 'user', content: enhancedPrompt }],
      model: "meta-llama/Llama-Vision-Free",
      max_tokens: 200,  // Increased to allow for multiple taglines
      temperature: 0.85,
      top_p: 0.95,
      top_k: 50,
      repetition_penalty: 1.2,
      stop: ["Human:", "Assistant:"],
    });

    const tagline = response.choices?.[0]?.message?.content?.trim() ?? '';
    res.status(200).json({ tagline });
  } catch (error) {
    console.error('Error generating tagline:', error);
    res.status(500).json({ message: 'Error generating tagline' });
  }
}