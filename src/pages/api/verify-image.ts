import { NextApiRequest, NextApiResponse } from 'next';
import FormData from 'form-data';
import fetch from 'node-fetch';

const OCR_API_KEY = process.env.OCR_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageUrl, expectedText } = req.body;

    if (!imageUrl || !expectedText) {
      return res.status(400).json({ message: 'Image URL and expected text are required' });
    }

    const formData = new FormData();
    formData.append('apikey', OCR_API_KEY);
    formData.append('url', imageUrl);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('OCREngine', '2'); // More accurate engine
    formData.append('scale', 'true');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData as any,
    });

    if (!response.ok) {
      throw new Error(`OCR API failed: ${response.status}`);
    }

    const data = await response.json() as {
      ParsedResults?: Array<{
        ParsedText: string;
        TextOverlay?: {
          Lines?: Array<{
            Words?: Array<{
              WordText: string;
            }>
          }>
        }
      }>
    } 

    if (!data.ParsedResults || data.ParsedResults.length === 0) {
      return res.status(200).json({ isValid: false, reason: 'No text found' });
    }

    const extractedText = data.ParsedResults[0].ParsedText;

    // Clean and normalize texts for comparison
    const cleanText = (str: string) => 
      str.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();

    const cleanedOCRText = cleanText(extractedText);
    const cleanedExpectedText = cleanText(expectedText);

    // Check if the expected text is found in the OCR result
    const isTextPresent = cleanedOCRText.includes(cleanedExpectedText);
    
    // Check for spelling errors by comparing individual words
    const expectedWords = cleanedExpectedText.split(/\s+/);
    const hasSpellingErrors = expectedWords.some(word => {
      const cleanWord = cleanText(word);
      if (cleanWord.length < 3) return false; // Skip very short words
      return cleanedOCRText.includes(cleanWord) && 
             cleanWord !== cleanedExpectedText &&
             !cleanedExpectedText.includes(cleanWord);
    });

    const isValid = isTextPresent && !hasSpellingErrors;

    res.status(200).json({
      isValid,
      extractedText,
      details: {
        textFound: isTextPresent,
        hasSpellingErrors,
        confidence: data.ParsedResults[0].TextOverlay?.Lines?.[0]?.Words?.[0]?.WordText || null
      }
    });

  } catch (error) {
    console.error('Error verifying image:', error);
    res.status(500).json({ message: 'Error verifying image' });
  }
}