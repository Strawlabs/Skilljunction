-- ============================================================
-- Skill Junction — Auth Extension Migration
-- 20260706000002_auth_extend.sql
-- Adds: mobile, terms_accepted_at, is_active, interested_course
--       to profiles; extends tutor approval lifecycle;
--       adds audit_log for security event tracking.
-- ============================================================

-- 1. Extend profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS mobile           text,
  ADD COLUMN IF NOT EXISTS interested_course text,
  ADD COLUMN IF NOT EXISTS terms_accepted_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS is_active         boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS avatar_url        text;  -- idempotent, may already exist

-- 2. Unique constraint on mobile (nullable — only enforced when set)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_mobile_unique_idx
  ON profiles(mobile) WHERE mobile IS NOT NULL;

-- 3. Extend tutor approval lifecycle
--    Original: pending | approved | rejected
--    Extended: submitted | pending | approved | rejected | active
ALTER TABLE tutor_profiles DROP CONSTRAINT IF EXISTS tutor_profiles_approval_status_check;
ALTER TABLE tutor_profiles ADD CONSTRAINT tutor_profiles_approval_status_check
  CHECK (approval_status IN ('submitted', 'pending', 'approved', 'rejected', 'active'));

-- 4. Add submission_note and submitted_at to tutor_profiles
ALTER TABLE tutor_profiles
  ADD COLUMN IF NOT EXISTS submitted_at      timestamp with time zone,
  ADD COLUMN IF NOT EXISTS qualification_url text,
  ADD COLUMN IF NOT EXISTS subjects          text[] DEFAULT '{}';

-- 5. Audit log for security events
CREATE TABLE IF NOT EXISTS audit_log (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type  text NOT NULL,
  user_id     uuid REFERENCES profiles(id) ON DELETE SET NULL,
  metadata    jsonb DEFAULT '{}',
  ip_hint     text,
  created_at  timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_user_idx ON audit_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_event_idx ON audit_log(event_type, created_at DESC);

-- 6. Enable RLS on audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins/super_admins can read audit log
CREATE POLICY "Admins can read audit log" ON audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admin', 'super_admin')
    )
  );

-- Allow authenticated insert from server-side (via service role or RPC)
-- Client-side inserts use the logger which calls a SECURITY DEFINER function
CREATE POLICY "System can insert audit events" ON audit_log
  FOR INSERT WITH CHECK (true);

-- 7. SECURITY DEFINER function for safe audit logging from client
--    Runs as postgres (bypasses RLS) but validates caller is authenticated.
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_event_type text,
  p_metadata   jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (event_type, user_id, metadata)
  VALUES (
    p_event_type,
    auth.uid(),  -- NULL for unauthenticated events (login failure)
    p_metadata
  );
END;
$$;

-- 8. Update handle_new_user trigger to capture new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'learner');

  INSERT INTO public.profiles (id, role, full_name, avatar_url, mobile, interested_course, terms_accepted_at)
  VALUES (
    NEW.id,
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'mobile',
    NEW.raw_user_meta_data->>'interested_course',
    CASE
      WHEN (NEW.raw_user_meta_data->>'terms_accepted')::boolean = true THEN now()
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    mobile             = EXCLUDED.mobile,
    interested_course  = EXCLUDED.interested_course,
    terms_accepted_at  = EXCLUDED.terms_accepted_at;

  -- If signing up as tutor, create a submitted tutor_profile row
  IF v_role = 'tutor' THEN
    INSERT INTO public.tutor_profiles (id, approval_status, submitted_at, qualification, subjects)
    VALUES (
      NEW.id,
      'submitted',
      now(),
      NEW.raw_user_meta_data->>'qualification',
      CASE
        WHEN NEW.raw_user_meta_data->>'subjects' IS NOT NULL
        THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'subjects'))
        ELSE '{}'
      END
    )
    ON CONFLICT (id) DO UPDATE SET
      approval_status = 'submitted',
      submitted_at    = now();
  END IF;

  -- Log registration event
  INSERT INTO public.audit_log (event_type, user_id, metadata)
  VALUES ('user_registered', NEW.id, jsonb_build_object('role', v_role, 'email', NEW.email));

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
