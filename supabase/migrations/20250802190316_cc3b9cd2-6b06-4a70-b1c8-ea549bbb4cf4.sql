-- Update profiles table to handle admin role for specific user
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'nafiakocks76@gmail.com'
);