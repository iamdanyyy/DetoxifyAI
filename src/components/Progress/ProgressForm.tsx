import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ensureUserProfile } from '../../lib/userUtils';
import { Calendar, Smile, Meh, Frown, Angry, Heart, Activity, FileText, Save } from 'lucide-react';

export const ProgressForm: React.FC = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('');
  const [cravingsLevel, setCravingsLevel] = useState(5);
  const [notes, setNotes] = useState('');
  const [addictionType, setAddictionType] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const moodOptions = [
    { value: 'excellent', label: 'Excellent', icon: Heart },
    { value: 'good', label: 'Good', icon: Smile },
    { value: 'okay', label: 'Okay', icon: Meh },
    { value: 'bad', label: 'Bad', icon: Frown },
    { value: 'terrible', label: 'Terrible', icon: Angry },
  ];

  const addictionOptions = [
    { value: 'alcohol', label: 'Alcohol' },
    { value: 'porn', label: 'Porn' },
    { value: 'masturbation', label: 'Masturbation' },
    { value: 'food', label: 'Food' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    try {
      // Ensure user profile exists before saving progress
      await ensureUserProfile(user);

      console.log('Attempting to save progress:', {
        user_id: user.id,
        date,
        mood,
        cravings_level: cravingsLevel,
        addiction_type: addictionType,
        notes: notes.trim(),
      });

      const { data, error } = await supabase
        .from('progress_logs')
        .insert([
          {
            user_id: user.id,
            date,
            mood,
            cravings_level: cravingsLevel,
            addiction_type: addictionType,
            notes: notes.trim(),
          },
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Progress saved successfully:', data);
      setSuccess(true);
      setMood('');
      setCravingsLevel(5);
      setNotes('');
      setAddictionType('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving progress:', error);
      alert(`Failed to save progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
          <Activity className="w-5 h-5 text-success-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Log Your Progress</h3>
          <p className="text-sm text-gray-500">Track your daily recovery journey</p>
        </div>
      </div>

      {success && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg mb-4">
          Progress logged successfully! Keep up the great work! 💪
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="addictionType" className="block text-sm font-medium text-gray-700 mb-1">
            Addiction Type
          </label>
          <select
            id="addictionType"
            value={addictionType}
            onChange={(e) => setAddictionType(e.target.value)}
            className="input-field"
            required
          >
            <option value="" disabled>Select type</option>
            {addictionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling today?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMood(option.value)}
                className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center ${
                  mood === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <option.icon className={`w-6 h-6 mb-1 ${mood === option.value ? 'text-primary-600' : 'text-gray-600'}`} />
                <div className="text-xs font-medium text-center">{option.label}</div>
              </button>
            ))}
          </div>
          {mood && (
            <p className="text-sm text-primary-600 mt-2">Selected: {moodOptions.find(opt => opt.value === mood)?.label}</p>
          )}
        </div>

        <div>
          <label htmlFor="cravings" className="block text-sm font-medium text-gray-700 mb-1">
            Cravings Level (1-10)
          </label>
          <div className="flex items-center gap-3">
            <input
              id="cravings"
              type="range"
              min="1"
              max="10"
              value={cravingsLevel}
              onChange={(e) => setCravingsLevel(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-700 min-w-[2rem]">
              {cravingsLevel}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>No cravings</span>
            <span>Intense cravings</span>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field pl-10 resize-none"
              rows={3}
              placeholder="How was your day? Any challenges or victories?"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !mood || !addictionType}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            loading || !mood || !addictionType
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : !mood ? (
            <>
              <Save className="w-4 h-4" />
              Select a mood to save progress
            </>
          ) : !addictionType ? (
            <>
              <Save className="w-4 h-4" />
              Select an addiction type to save
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Progress
            </>
          )}
        </button>
      </form>
    </div>
  );
};

