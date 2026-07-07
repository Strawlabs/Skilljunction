-- ============================================================
-- Skill Junction — Extension Migration
-- 20260702000001_extend.sql
-- ============================================================

-- 1. Add super_admin to the role check constraint
-- We need to drop and recreate the check constraint on profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('learner', 'tutor', 'admin', 'super_admin', 'parent', 'finance'));

-- 2. Tutor extension table (qualification, subjects, approval pipeline)
CREATE TABLE IF NOT EXISTS tutor_profiles (
  id               uuid REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  qualification    text,
  experience_years integer DEFAULT 0,
  subjects         text[] DEFAULT '{}',
  bio              text,
  hourly_rate      numeric DEFAULT 0,
  approval_status  text NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  approved_by      uuid REFERENCES profiles(id),
  approved_at      timestamp with time zone,
  created_at       timestamp with time zone DEFAULT now()
);

-- 3. Add payment_proof_url to payments
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS payment_proof_url text,
  ADD COLUMN IF NOT EXISTS proof_uploaded_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS verification_note text;

-- Update payments status check to include new states
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;
ALTER TABLE payments ADD CONSTRAINT payments_status_check
  CHECK (status IN ('pending', 'pending_verification', 'verified', 'rejected', 'overdue'));

-- 4. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title       text NOT NULL,
  message     text NOT NULL,
  type        text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  link        text,
  is_read     boolean DEFAULT false,
  created_at  timestamp with time zone DEFAULT now()
);

-- Index for fast unread count queries
CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
  ON notifications(user_id, is_read) WHERE is_read = false;

-- 5. Session attendance tracking
CREATE TABLE IF NOT EXISTS session_attendance (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  uuid REFERENCES sessions(id) ON DELETE CASCADE,
  learner_id  uuid REFERENCES profiles(id) ON DELETE CASCADE,
  attended    boolean DEFAULT false,
  joined_at   timestamp with time zone,
  UNIQUE(session_id, learner_id)
);

-- 6. Session participants (link sessions to enrolled learners)
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS max_participants integer DEFAULT 30;

-- 7. Contact enquiries (for the home page contact form)
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  email       text NOT NULL,
  subject     text,
  message     text NOT NULL,
  created_at  timestamp with time zone DEFAULT now()
);

-- 8. Quiz questions: add explanation field for result review
ALTER TABLE quiz_questions
  ADD COLUMN IF NOT EXISTS explanation text;

-- 9. Quiz attempts: add total_questions and time_taken
ALTER TABLE quiz_attempts
  ADD COLUMN IF NOT EXISTS total_questions integer,
  ADD COLUMN IF NOT EXISTS time_taken_seconds integer,
  ADD COLUMN IF NOT EXISTS completed boolean DEFAULT true;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Enable RLS on new tables
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

-- ── tutor_profiles ──
CREATE POLICY "Tutor profiles viewable by all authenticated" ON tutor_profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Tutors can insert own profile" ON tutor_profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Tutors can update own profile" ON tutor_profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

CREATE POLICY "Admins can update any tutor profile" ON tutor_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admin', 'super_admin')
    )
  );

-- ── notifications ──
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can mark own notifications read" ON notifications
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can insert notifications for anyone" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admin', 'super_admin')
    )
  );

-- ── session_attendance ──
CREATE POLICY "Learners see own attendance" ON session_attendance
  FOR SELECT USING ((SELECT auth.uid()) = learner_id);

CREATE POLICY "Tutors see attendance for their sessions" ON session_attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = session_id
        AND s.tutor_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins see all attendance" ON session_attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admin', 'super_admin')
    )
  );

-- ── payments (extend existing) ──
CREATE POLICY "Learners see own payments" ON payments
  FOR SELECT USING ((SELECT auth.uid()) = learner_id);

CREATE POLICY "Learners can update own payment proof" ON payments
  FOR UPDATE USING ((SELECT auth.uid()) = learner_id)
  WITH CHECK ((SELECT auth.uid()) = learner_id);

CREATE POLICY "Admins see all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admin', 'super_admin', 'finance')
    )
  );

CREATE POLICY "Admins can update payment status" ON payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admin', 'super_admin', 'finance')
    )
  );

-- ── sessions (extend existing) ──
CREATE POLICY "Tutors see own sessions" ON sessions
  FOR SELECT USING ((SELECT auth.uid()) = tutor_id);

CREATE POLICY "Tutors can insert sessions" ON sessions
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = tutor_id);

CREATE POLICY "Tutors can update own sessions" ON sessions
  FOR UPDATE USING ((SELECT auth.uid()) = tutor_id);

CREATE POLICY "Learners see sessions for enrolled courses" ON sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.course_id = sessions.course_id
        AND e.learner_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins see all sessions" ON sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admin', 'super_admin')
    )
  );

-- ── courses (extend existing) ──
CREATE POLICY "Tutors can insert courses" ON courses
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = tutor_id);

CREATE POLICY "Tutors can update own courses" ON courses
  FOR UPDATE USING ((SELECT auth.uid()) = tutor_id);

CREATE POLICY "Admins can manage all courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admin', 'super_admin')
    )
  );

-- ── quizzes (extend existing) ──
CREATE POLICY "Tutors can insert quizzes" ON quizzes
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = created_by);

CREATE POLICY "Tutors can update own quizzes" ON quizzes
  FOR UPDATE USING ((SELECT auth.uid()) = created_by);

CREATE POLICY "Learners see quizzes for enrolled courses" ON quizzes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.course_id = quizzes.course_id
        AND e.learner_id = (SELECT auth.uid())
    )
  );

-- ── parent_children (extend existing) ──
CREATE POLICY "Parents see own child links" ON parent_children
  FOR SELECT USING ((SELECT auth.uid()) = parent_id);

CREATE POLICY "Parents see their children's profiles" ON profiles
  FOR SELECT USING (
    (SELECT auth.uid()) = id
    OR EXISTS (
      SELECT 1 FROM parent_children
      WHERE parent_id = (SELECT auth.uid())
        AND child_id = id
    )
  );

-- ── contact_enquiries ──
CREATE POLICY "Anyone can insert contact enquiry" ON contact_enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read contact enquiries" ON contact_enquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('admin', 'super_admin')
    )
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile row when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'learner'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- If signing up as tutor, create pending tutor_profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'learner') = 'tutor' THEN
    INSERT INTO public.tutor_profiles (id, approval_status)
    VALUES (NEW.id, 'pending')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- SUPABASE STORAGE BUCKET
-- ============================================================
-- Run this in the Supabase dashboard Storage section, or via the API.
-- Bucket name: payment-proofs
-- Public: false (files accessed via signed URLs only)
-- Allowed MIME types: image/jpeg, image/png, image/webp, application/pdf

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('payment-proofs', 'payment-proofs', false)
-- ON CONFLICT (id) DO NOTHING;

-- Storage RLS policy (enable in dashboard):
-- Learners can upload to their own folder (user_id/*)
-- Admins can read all files
