-- Fix for existing user profile
-- Run this in your Supabase SQL Editor

-- First, let's see what users exist in auth.users
SELECT id, email, raw_user_meta_data FROM auth.users;

-- Then create a profile for the user (replace 'your-user-id' with the actual user ID from above)
-- You can get your user ID from the browser console by running: console.log(supabase.auth.getUser())

-- Example (replace with your actual user ID):
-- INSERT INTO public.users (id, email, username, sobriety_start, is_premium)
-- VALUES (
--     'your-user-id-here',
--     'emmanuelamdany1@gmail.com',
--     'YourUsername',
--     CURRENT_DATE,
--     false
-- );

-- Or if you want to create it for all users without profiles:
INSERT INTO public.users (id, email, username, sobriety_start, is_premium)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'username', 'User'),
    COALESCE((au.raw_user_meta_data->>'sobriety_start')::date, CURRENT_DATE),
    false
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
