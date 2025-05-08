import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/profile');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);
  // Get the current URL for redirect
  const getRedirectURL = () => {
    if (typeof window !== 'undefined') {
      // For production (Vercel)
      if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`;
      }
      // For local development
      return `${window.location.origin}/auth/callback`;
    }
    return '/auth/callback';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Thought AI
          </h1>
          <p className="text-gray-600 mt-2">Sign in to access all features</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4F46E5',
                    brandAccent: '#4338CA',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                button: 'w-full px-4 py-2 rounded-lg font-medium transition-colors',
                container: 'flex flex-col gap-4',
                label: 'text-sm font-medium text-gray-700',
                input: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                divider: 'my-4',
              },
            }}
            providers={['google']}
            view="magic_link"
            showLinks={true}
            redirectTo={getRedirectURL()}
          />
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}