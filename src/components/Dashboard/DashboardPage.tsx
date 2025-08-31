import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ProgressDashboard } from '../Progress/ProgressDashboard';
import { ProgressForm } from '../Progress/ProgressForm';
import { Heart, TrendingUp, Target, Award } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSobrietyDays = () => {
    if (!userProfile?.sobriety_start) return 0;
    return differenceInDays(new Date(), new Date(userProfile.sobriety_start));
  };

  const getMotivationalMessage = () => {
    const days = getSobrietyDays();
    
    if (days === 0) {
      return "Today is the first day of your new life. You've taken the most important step!";
    } else if (days === 1) {
      return "You've made it through your first day! Every journey begins with a single step.";
    } else if (days < 7) {
      return `You're ${days} days strong! The first week is often the toughest, and you're doing amazing.`;
    } else if (days < 30) {
      return `Incredible! ${days} days of sobriety. You're building a foundation for lasting change.`;
    } else if (days < 90) {
      return `${days} days! You're developing new habits and patterns. Keep going!`;
    } else {
      return `${days} days of freedom! You're an inspiration to others on this journey.`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {userProfile?.username || 'Warrior'}!
                </h1>
                <p className="text-primary-100 mt-1">
                  {getMotivationalMessage()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6" />
                  <div>
                    <p className="text-sm text-primary-100">Sobriety Days</p>
                    <p className="text-2xl font-bold">{getSobrietyDays()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  <div>
                    <p className="text-sm text-primary-100">Status</p>
                    <p className="text-2xl font-bold">
                      {userProfile?.is_premium ? 'Premium' : 'Free'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6" />
                  <div>
                    <p className="text-sm text-primary-100">Next Milestone</p>
                    <p className="text-2xl font-bold">
                      {getSobrietyDays() < 7 ? '7 Days' : 
                       getSobrietyDays() < 30 ? '30 Days' : 
                       getSobrietyDays() < 90 ? '90 Days' : '1 Year'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Form */}
          <div className="lg:col-span-1">
            <ProgressForm />
          </div>

          {/* Dashboard */}
          <div className="lg:col-span-2">
            <ProgressDashboard />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/chat"
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Chat with AI</h3>
                  <p className="text-sm text-gray-500">Get support and guidance</p>
                </div>
              </div>
            </a>

            <a
              href="/progress"
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View Progress</h3>
                  <p className="text-sm text-gray-500">Track your journey</p>
                </div>
              </div>
            </a>

            {!userProfile?.is_premium && (
              <a
                href="/premium"
                className="card hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Go Premium</h3>
                    <p className="text-sm text-gray-500">Unlock advanced features</p>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

