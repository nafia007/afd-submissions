-- Update the admin user role for nafiakocks76@gmail.com
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'nafiakocks76@gmail.com'
);