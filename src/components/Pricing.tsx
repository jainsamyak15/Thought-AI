import React, { useState } from 'react';

declare global {
  interface Window {
    Cashfree: any;
  }
}
import { motion } from 'framer-motion';
import { Check, Loader } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

const plans = [
  {
    name: 'Starter',
    price: '₹10',
    credits: '500 credits',
    amount: 10,
    creditsAmount: 500,
    qrCode: '/WhatsApp Image 2024-11-07 at 12.03.21 AM.jpeg',
    features: [
      'Logo Generation',
      'Twitter Banner Design',
      'Basic Tagline Generation',
      'Standard Support',
      'Easy Customization'
    ]
  },
  {
    name: 'Pro',
    price: '₹50',
    credits: '2500 credits',
    amount: 50,
    creditsAmount: 2500,
    qrCode: '/WhatsApp Image 2024-11-07 at 12.03.21 AM.jpeg',
    features: [
      'Everything in Starter',
      'Priority Generation',
      'Advanced Customization',
      'Priority Support',
      'Brand Kit Storage'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '₹100',
    credits: 'Unlimited credits',
    amount: 100,
    creditsAmount: 10000,
    qrCode: '/WhatsApp Image 2024-11-07 at 12.03.21 AM.jpeg',
    features: [
      'Everything in Pro',
      'Custom Solutions',
      'API Access',
      'Dedicated Support',
      'Team Collaboration'
    ]
  }
];

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  const handlePayment = (plan: any) => {
    setLoading(plan.name);
    setSelectedPlan(plan);
  };

  const handlePaymentVerification = async () => {
    setLoading('verifying');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please sign in to verify payment');
        setLoading(null);
        return;
      }

      // Simulate payment verification
      const isPaymentSuccessful = true; // Replace with actual payment verification logic

      if (isPaymentSuccessful) {
        const { data: currentCredits } = await supabase
          .from('user_credits')
          .select('total_credits')
          .eq('user_id', user.id)
          .single();

        if (currentCredits) {
          await supabase
            .from('user_credits')
            .update({
              total_credits: currentCredits.total_credits + selectedPlan.creditsAmount
            })
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('user_credits')
            .insert({
              user_id: user.id,
              total_credits: selectedPlan.creditsAmount
            });
        }

        alert('Payment verified and credits added successfully!');
      } else {
        alert('Payment verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
      setSelectedPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Simple Pricing
          </h2>
          <p className="text-xl text-gray-400">
            Choose the perfect plan for your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">{plan.price}</div>
                <div className="text-gray-400">{plan.credits}</div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-purple-400 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                disabled={loading === plan.name}
                className={`w-full py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center ${
                  loading === plan.name ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading === plan.name ? (
                  <>
                    <Loader className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Pay with UPI'
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4">Scan to Pay</h3>
              <p className="text-lg text-gray-500 mb-4">
                Scan the QR code below to pay for the {selectedPlan.name} plan.
              </p>
              <Image
                src={selectedPlan.qrCode}
                alt={`${selectedPlan.name} Plan QR Code`}
                width={200}
                height={200}
              />
              <p className="text-lg text-gray-500 mt-4">
                After completing the payment, click the button below to verify your payment and activate your credits.
              </p>
              <button
                onClick={handlePaymentVerification}
                className="mt-4 py-2 px-4 bg-green-500 text-white rounded-full"
                disabled={loading === 'verifying'}
              >
                {loading === 'verifying' ? (
                  <>
                    <Loader className="animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify Payment'
                )}
              </button>
              <button
                onClick={() => setSelectedPlan(null)}
                className="mt-4 py-2 px-4 bg-red-500 text-white rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;