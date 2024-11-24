import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const formatTimeAgo = (timestamp: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};

const ActivityToast = () => {
  useEffect(() => {
    console.log('Setting up Supabase real-time subscription...');

    const channel = supabase
      .channel('activity-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'generated_images',
        },
        async (payload) => {
          console.log('Received real-time event:', payload);
          
          try {
            // Get current user data
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
              console.error('Error fetching user:', error);
              return;
            }

            console.log('Current user data:', user);

            // Only show toast if it's not the current user's action
            if (user?.id !== payload.new.user_id) {
              const userName = 'Someone'; // For privacy, we don't show other users' names
              const type = payload.new.type;
              const timeAgo = formatTimeAgo(payload.new.created_at);

              console.log('Showing toast for:', { userName, type, timeAgo });

              toast.custom((t) => (
                <div
                  className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                  } max-w-md w-full bg-[#151515] border border-white/10 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {userName}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          Generated a new {type} {timeAgo}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-white/10">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-200 focus:outline-none"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ), {
                duration: 5000,
                position: 'bottom-right',
              });
            }
          } catch (error) {
            console.error('Error processing activity:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up Supabase subscription...');
      channel.unsubscribe();
    };
  }, []);

  return <Toaster />;
};

export default ActivityToast;