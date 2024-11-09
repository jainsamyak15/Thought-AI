import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeCredits = async (userId: string) => {
      try {
        // First, try to get existing credits
        const { data: existingCredits, error: selectError } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', userId)
          .single();

        // If no credits found or there's an error, create new credits
        if (!existingCredits || selectError) {
          const { error: insertError } = await supabase
            .from('user_credits')
            .upsert([
              {
                user_id: userId,
                total_credits: 500,
                used_credits: 0
              }
            ], {
              onConflict: 'user_id'
            });

          if (insertError) {
            console.error('Error initializing credits:', insertError);
          }
        }
      } catch (error) {
        console.error('Error in credits initialization:', error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        await initializeCredits(currentUser.id);
      }
    });

    // Check current session on mount
    const checkSession = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        await initializeCredits(currentUser.id);
      }
    };
    
    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div>
      {user ? (
        <button
          onClick={handleSignOut}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          Sign In
        </button>
      )}
    </div>
  );
}