import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Get your free API key from https://ocr.space/ocrapi
const OCR_API_KEY = process.env.OCR_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const formData = new FormData();
    formData.append('apikey', OCR_API_KEY);
    formData.append('url', imageUrl);
    formData.append('language', 'eng'); // Can be changed to other languages
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('OCREngine', '2'); // More accurate engine

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OCR API failed: ${response.status}`);
    }

    const data: {
      ParsedResults: Array<{
        ParsedText: string;
        TextOverlay?: {
          Lines?: Array<{
            Words?: Array<{
              WordText?: string;
            }>;
          }>;
        };
      }>;
    } = await response.json() as {
      ParsedResults: Array<{
        ParsedText: string;
        TextOverlay?: {
          Lines?: Array<{
            Words?: Array<{
              WordText?: string;
            }>;
          }>;
        };
      }>;
    };

    if (!data.ParsedResults || data.ParsedResults.length === 0) {
      return res.status(400).json({ message: 'No text found in image' });
    }

    res.status(200).json({
      result: {
        text: data.ParsedResults[0].ParsedText,
        success: true,
        confidence: data.ParsedResults[0].TextOverlay?.Lines?.[0]?.Words?.[0]?.WordText || null,
      }
    });

  } catch (error) {
    console.error('Error extracting text:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      message: 'Error extracting text from image',
      error: errorMessage
    });
  }
}