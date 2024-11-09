import { supabase } from '../lib/supabase';

export async function uploadImageToStorage(imageUrl: string, type: 'logo' | 'banner'): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        userId: user.id,
        type
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}