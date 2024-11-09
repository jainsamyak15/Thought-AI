import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { description, category } = req.body;

    const prompt = `You are a Silicon Valley naming expert who has named numerous successful startups. Create 5 powerful, trendy brand names similar to Netflix, Apple, Amazon, Google, Meta, Nvidia, Zepto, and Zomato.

For this ${category} startup:
${description}

Name Style Guidelines:
1. Memorable & Distinctive:
- Create names as memorable as "Google" or "Netflix"
- Use creative letter combinations like "Nvidia"
- Consider memorable patterns like alliteration or rhythmic sounds
- Aim for names that could become verbs like "Google it"

2. Modern Tech Aesthetic:
- Use strong consonants and vowel patterns
- Consider dropping vowels like "Flickr" or "Tumblr"
- Explore letter substitutions (e.g., using 'Z' instead of 'S')
- Think abstract yet meaningful like "Meta"

3. Structural Requirements:
- Maximum 2-3 syllables like "Apple" or "Netflix"
- Should sound natural in phrases like "Let's Netflix"
- Must work as a .com domain
- Should work well as an app icon
- Easy to pronounce globally

4. Brand Power:
- Should feel established and trustworthy like "Amazon"
- Must have potential to become a household name
- Should work across multiple products/services
- Must have strong visual potential for logos

Format Requirements:
- Return exactly 5 names
- One per line
- Names only, no explanations
- Each name should be completely unique
- Must be suitable for a modern tech company

Think of the impact and memorability of names like:
- Netflix (streaming)
- Meta (social/tech)
- Nvidia (technology)
- Zepto (quick commerce)
- Zomato (food delivery)

Create names with similar power and appeal, perfectly suited for ${category}.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
      },
    });
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Process the response similar to before
    const names = text
      .trim()
      .split('\n')
      .filter(Boolean)
      .slice(0, 5);

    res.status(200).json({ names });
  } catch (error) {
    console.error('Error generating brand names:', error);
    res.status(500).json({ message: 'Error generating brand names' });
  }
}