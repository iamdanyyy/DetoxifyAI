import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../lib/payments';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment ID from URL or localStorage
        const paymentId = searchParams.get('payment_id') || localStorage.getItem('pending_payment_id');
        
        if (!paymentId) {
          setError('No payment ID found');
          setLoading(false);
          return;
        }

        console.log('Verifying payment:', paymentId);

        // Verify payment with IntaSend
        const isPaymentValid = await paymentService.verifyPayment(paymentId);

        if (isPaymentValid) {
          // Update user subscription status in database
          if (user) {
            const { error: updateError } = await supabase
              .from('users')
              .update({ is_premium: true })
              .eq('id', user.id);

            if (updateError) {
              console.error('Error updating user subscription:', updateError);
              setError('Payment verified but failed to update subscription');
            } else {
              setSuccess(true);
              // Clear pending payment ID
              localStorage.removeItem('pending_payment_id');
            }
          }
        } else {
          setError('Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setError('Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [user, searchParams]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="card max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="card max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/premium')}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="card max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Premium! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Your payment was successful and your premium subscription is now active.
          </p>
          
          <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-success-800 mb-2">Premium Features Unlocked:</h3>
            <ul className="text-sm text-success-700 space-y-1">
              <li>✓ Unlimited AI Chat</li>
              <li>✓ Personalized Recovery Plans</li>
              <li>✓ Advanced Analytics</li>
              <li>✓ Priority Support</li>
            </ul>
          </div>

          <button
            onClick={handleContinue}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Continue to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
