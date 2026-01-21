-- Create profile for the admin user
INSERT INTO public.profiles (id, user_id, role, created_at)
VALUES ('eeb5d81d-293d-4106-857d-22e60dc7d991', 'eeb5d81d-293d-4106-857d-22e60dc7d991', 'admin', NOW())
ON CONFLICT (id) DO UPDATE SET role = 'admin';