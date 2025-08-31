import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ProgressLog } from '../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, differenceInDays } from 'date-fns';
import { TrendingUp, Calendar, Target, Award, Heart, Smile, Meh, Frown, Angry } from 'lucide-react';

export const ProgressDashboard: React.FC = () => {
  const { user } = useAuth();
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProgressLogs();
      fetchUserProfile();
    }
  }, [user]);

  const fetchProgressLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setProgressLogs(data || []);
    } catch (error) {
      console.error('Error fetching progress logs:', error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const getSobrietyDays = () => {
    if (!userProfile?.sobriety_start) return 0;
    return differenceInDays(new Date(), new Date(userProfile.sobriety_start));
  };

  const getCurrentStreak = () => {
    if (progressLogs.length === 0) return 0;
    
    const sortedLogs = [...progressLogs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      const daysDiff = differenceInDays(currentDate, logDate);
      
      if (daysDiff <= 1) {
        streak++;
        currentDate = logDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getAverageCravings = () => {
    if (progressLogs.length === 0) return 0;
    const total = progressLogs.reduce((sum, log) => sum + log.cravings_level, 0);
    return Math.round(total / progressLogs.length * 10) / 10;
  };

  const getMoodDistribution = () => {
    const moodCounts: { [key: string]: number } = {};
    progressLogs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    });
    return Object.entries(moodCounts).map(([mood, count]) => ({ mood, count }));
  };

  const getChartData = () => {
    return progressLogs.slice(-7).map(log => ({
      date: format(new Date(log.date), 'MMM dd'),
      cravings: log.cravings_level,
      mood: getMoodScore(log.mood),
    }));
  };

  const getMoodScore = (mood: string) => {
    const scores: { [key: string]: number } = {
      'excellent': 5,
      'good': 4,
      'okay': 3,
      'bad': 2,
      'terrible': 1,
    };
    return scores[mood] || 3;
  };

  const getMoodIcon = (mood: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      excellent: Heart,
      good: Smile,
      okay: Meh,
      bad: Frown,
      terrible: Angry,
    };
    const IconComponent = icons[mood] || Meh;
    return <IconComponent className="w-6 h-6 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sobriety Days</p>
              <p className="text-2xl font-bold text-gray-900">{getSobrietyDays()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{getCurrentStreak()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Cravings</p>
              <p className="text-2xl font-bold text-gray-900">{getAverageCravings()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cravings Trend */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Cravings Trend (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="cravings" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Mood Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMoodDistribution()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {progressLogs.slice(-5).reverse().map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                             <div className="flex items-center gap-3">
                 <div className="flex items-center justify-center w-8 h-8">
                   {getMoodIcon(log.mood)}
                 </div>
                <div>
                  <p className="font-medium text-gray-900">{format(new Date(log.date), 'MMM dd, yyyy')}</p>
                  <p className="text-sm text-gray-500">Cravings: {log.cravings_level}/10</p>
                </div>
              </div>
              {log.notes && (
                <p className="text-sm text-gray-600 max-w-xs truncate">{log.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

