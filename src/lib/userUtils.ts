import { supabase } from './supabase';

export const ensureUserProfile = async (user: any) => {
  if (!user) return;

  try {
    // Check if user profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('Creating user profile for:', user.id);
      
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.username || 'User',
            sobriety_start: user.user_metadata?.sobriety_start || new Date().toISOString().split('T')[0],
            is_premium: false,
          },
        ]);

      if (insertError) {
        console.error('Failed to create user profile:', insertError);
        throw insertError;
      }

      console.log('User profile created successfully');
    } else if (fetchError) {
      console.error('Error checking user profile:', fetchError);
      throw fetchError;
    } else {
      console.log('User profile already exists');
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    throw error;
  }
};
