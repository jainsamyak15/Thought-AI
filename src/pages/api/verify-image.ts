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
    formData.append('OCREngine', '2');
    formData.append('scale', 'true');
    formData.append('isTable', 'false');
    formData.append('filetype', 'PNG');
    // Enhanced OCR settings
    formData.append('detectCheckbox', 'false');
    formData.append('checkboxTemplate', '0');
    // formData.append('preprocessParams', JSON.stringify({
    //   "enhance": true,
    //   "dehaze": true,
    //   "denoise": true,
    //   "contrastCorrection": true
    // }));

    console.log('Sending OCR request for image:', imageUrl);
    console.log('Expected text:', expectedText);

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData as any,
      headers: {
        'apikey': OCR_API_KEY!
      }
    });

    if (!response.ok) {
      console.error('OCR API error:', response.status, response.statusText);
      throw new Error(`OCR API failed: ${response.status}`);
    }

    const data: any = await response.json();
    console.log('OCR Response:', data);

    if (!data.ParsedResults || data.ParsedResults.length === 0) {
      console.log('No text found in image');
      return res.status(200).json({ isValid: false, reason: 'No text found' });
    }

    const extractedText = data.ParsedResults[0].ParsedText;
    console.log('Extracted text:', extractedText);

    // Enhanced text comparison
    const cleanText = (str: string) => 
      str.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();

    const cleanedOCRText = cleanText(extractedText);
    const cleanedExpectedText = cleanText(expectedText);

    console.log('Cleaned OCR text:', cleanedOCRText);
    console.log('Cleaned expected text:', cleanedExpectedText);

    // More flexible matching
    const isTextPresent = cleanedOCRText.includes(cleanedExpectedText)  
                         || cleanedExpectedText.includes(cleanedOCRText) 
                         // Check for partial matches (at least 70% of characters match)
                         || (cleanedExpectedText.length > 3 && 
                          cleanedOCRText.split('').filter(char => cleanedExpectedText.includes(char)).length >= cleanedExpectedText.length * 0.7);

    // Check for spelling errors by comparing individual words
    const expectedWords = cleanedExpectedText.split(/\s+/);
    const hasSpellingErrors = expectedWords.some(word => {
      const cleanWord = cleanText(word);
      if (cleanWord.length < 3) return false; // Skip very short words
      return !cleanedOCRText.includes(cleanWord);
    });

    const isValid = isTextPresent && !hasSpellingErrors;

    console.log('Verification result:', {
      isValid,
      textFound: isTextPresent,
      hasSpellingErrors,
      confidence: data.ParsedResults[0].TextOverlay?.Lines?.[0]?.Words?.[0]?.WordText || null
    });

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