import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface CreditDisplayProps {
  serviceCost: number;
  serviceType: 'logo' | 'banner' | 'tagline';
}

interface Credits {
  total_credits: number;
  used_credits: number;
}

const CreditDisplay: React.FC<CreditDisplayProps> = ({ serviceCost, serviceType }) => {
  const [credits, setCredits] = useState<Credits>({ total_credits: 0, used_credits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchCredits = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('user_credits')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (mounted && data) {
            setCredits({
              total_credits: data.total_credits,
              used_credits: data.used_credits
            });
          }
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCredits();

    // Set up real-time subscription
    const channel = supabase
      .channel('credit_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_credits'
        },
        (payload) => {
          if (mounted) {
            setCredits(payload.new as Credits);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, []);

  const remainingCredits = credits.total_credits - credits.used_credits;
  const remainingDollars = (remainingCredits / 100).toFixed(2);
  const serviceCostDollars = (serviceCost / 100).toFixed(2);

  const costLabel = {
    logo: `Logo generation costs $${serviceCostDollars}`,
    banner: `Banner generation costs $${serviceCostDollars}`,
    tagline: `Tagline generation costs $${serviceCostDollars}`
  }[serviceType];

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600">{costLabel}</p>
          <p className="text-lg font-bold text-gray-800">
            Remaining Credits: ${remainingDollars}
          </p>
        </div>
        {remainingCredits < serviceCost && (
          <p className="text-red-500 text-sm font-medium">
            Insufficient credits for generation
          </p>
        )}
      </div>
    </div>
  );
};

export default CreditDisplay;