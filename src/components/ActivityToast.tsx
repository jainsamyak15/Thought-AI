import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

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
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
              console.error('Error fetching user:', error);
              return;
            }

            console.log('Current user data:', user);

            if (user?.id !== payload.new.user_id) {
              const userName = 'Someone';
              const type = payload.new.type;
              const timeAgo = formatTimeAgo(payload.new.created_at);

              console.log('Showing toast for:', { userName, type, timeAgo });

              toast.custom((t) => (
                <AnimatePresence>
                  {t.visible && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className="max-w-md w-full bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl rounded-xl overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-[#FF6500]/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-[#FF6500]" />
                              </div>
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></span>
                            </div>
                            <div>
                              <h3 className="font-medium text-white">New Creation!</h3>
                              <p className="text-sm text-gray-400">
                                {userName} just created a new {type}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="mt-3">
                          <div className="w-full h-1 bg-gradient-to-r from-[#FF6500] to-purple-600 rounded-full">
                            <motion.div
                              initial={{ width: "100%" }}
                              animate={{ width: "0%" }}
                              transition={{ duration: 5, ease: "linear" }}
                              className="h-full bg-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

  return (
    <Toaster 
      containerStyle={{
        bottom: 40,
        right: 40,
      }}
      toastOptions={{
        className: '',
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  );
};

export default ActivityToast;