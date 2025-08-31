import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../lib/payments';
import { Crown, Check, CreditCard, Zap, MessageCircle, Target } from 'lucide-react';

export const PremiumUpgrade: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const premiumFeatures = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Unlimited AI Chat',
      description: 'Get unlimited conversations with DetoxifyAI',
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Personalized Plans',
      description: 'Custom recovery plans tailored to your journey',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Advanced Analytics',
      description: 'Detailed insights and progress tracking',
    },
    {
      icon: <Check className="w-5 h-5" />,
      title: 'Priority Support',
      description: '24/7 access to recovery resources',
    },
  ];

  const handleUpgrade = async () => {
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    // Debug: Check environment configuration
    console.log('Environment check:');
    console.log('REACT_APP_INTASEND_PUBLIC_KEY configured:', !!process.env.REACT_APP_INTASEND_PUBLIC_KEY);
    console.log('REACT_APP_INTASEND_SECRET_KEY configured:', !!process.env.REACT_APP_INTASEND_SECRET_KEY);
    console.log('Public key format:', process.env.REACT_APP_INTASEND_PUBLIC_KEY?.substring(0, 20) + '...');

    try {
      const paymentData = {
        amount: 29.99,
        currency: 'USD',
        email: user.email || '',
        first_name: user.user_metadata?.username?.split(' ')[0] || 'User',
        last_name: user.user_metadata?.username?.split(' ').slice(1).join(' ') || '',
        phone_number: '+1234567890', // This should come from user profile
        description: 'DetoxifyAI Premium Subscription - Monthly',
      };

      const response = await paymentService.createPayment(paymentData);

      if (response.success && response.checkout_url) {
        // Store payment ID in localStorage for verification
        localStorage.setItem('pending_payment_id', response.payment_id || '');
        
        // Redirect to payment page
        window.location.href = response.checkout_url;
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
        <p className="text-gray-600">Unlock advanced features to accelerate your recovery journey</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg mb-6">
          Payment successful! Welcome to Premium! 🎉
        </div>
      )}

      {/* Pricing */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">$29.99</div>
          <div className="text-gray-600 mb-4">per month</div>
          <div className="text-sm text-gray-500">Cancel anytime • No commitment</div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Premium Features</h3>
        {premiumFeatures.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="text-primary-600">{feature.icon}</div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Button */}
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Upgrade to Premium
          </>
        )}
      </button>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500 mb-4">
          Secure payment powered by IntaSend • Your data is protected
        </p>
        
        {/* IntaSend Trust Badge */}
        <div className="flex justify-center">
          <div className="text-center">
            <a href="https://intasend.com/security" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://intasend-prod-static.s3.amazonaws.com/img/trust-badges/intasend-trust-badge-no-mpesa-hr-dark.png" 
                width="375px" 
                alt="IntaSend Secure Payments (PCI-DSS Compliant)"
                className="mx-auto"
              />
            </a>
            <div className="mt-2">
              <a 
                href="https://intasend.com/security" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-600 text-decoration-none text-sm hover:text-gray-800 transition-colors"
              >
                Secured by IntaSend Payments
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

