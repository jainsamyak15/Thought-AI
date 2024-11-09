import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      // Exchange the code for a session
      const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (user) {
        // First, try to get existing credits
        const { data: existingCredits, error: selectError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // If no credits found or there's an error, create new credits
        if (!existingCredits || selectError) {
          const { error: insertError } = await supabase
            .from('user_credits')
            .upsert([
              {
                user_id: user.id,
                total_credits: 500,
                used_credits: 0
              }
            ], { 
              onConflict: 'user_id'
            });

          if (insertError) {
            console.error('Error initializing credits:', insertError);
            throw insertError;
          }
        }
      }
    }

    return NextResponse.redirect(new URL('/profile', requestUrl.origin));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}