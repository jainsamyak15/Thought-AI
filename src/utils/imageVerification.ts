import { supabase } from '../lib/supabase';

export const verifyGeneratedImage = async (imageUrl: string, expectedText: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/verify-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        expectedText,
      }),
    });

    if (!response.ok) {
      console.error('Verification request failed:', response.status);
      return false;
    }

    const data = await response.json();
    
    if (!data.isValid) {
      console.log('Image verification failed:', data.details);
    }

    return data.isValid;
  } catch (error) {
    console.error('Error during image verification:', error);
    return false;
  }
};