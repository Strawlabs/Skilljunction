-- Core user profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('learner', 'tutor', 'admin', 'parent', 'finance')),
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Courses
create table if not exists courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  tutor_id uuid references profiles(id),
  price numeric,
  thumbnail_url text,
  category text,
  level text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enrollments
create table if not exists enrollments (
  id uuid default uuid_generate_v4() primary key,
  learner_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  progress_pct integer default 0,
  status text default 'active'
);

-- Lessons
create table if not exists lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  content_url text,
  duration_mins integer,
  order_index integer not null
);

-- Quizzes & Questions
create table if not exists quizzes (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  created_by uuid references profiles(id)
);

create table if not exists quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references quizzes(id) on delete cascade,
  question_text text not null,
  options jsonb not null,
  correct_answer text not null
);

create table if not exists quiz_attempts (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references quizzes(id) on delete cascade,
  learner_id uuid references profiles(id) on delete cascade,
  score integer,
  answers jsonb,
  attempted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Study Resources
create table if not exists resources (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  type text,
  url text not null,
  uploaded_by uuid references profiles(id)
);

-- Sessions / Calendar
create table if not exists sessions (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade,
  tutor_id uuid references profiles(id),
  starts_at timestamp with time zone not null,
  ends_at timestamp with time zone not null,
  meeting_url text,
  status text default 'scheduled'
);

-- Payments
create table if not exists payments (
  id uuid default uuid_generate_v4() primary key,
  learner_id uuid references profiles(id),
  course_id uuid references courses(id),
  amount numeric not null,
  status text default 'pending',
  due_date timestamp with time zone,
  paid_at timestamp with time zone
);

-- Parent-Child linking
create table if not exists parent_children (
  parent_id uuid references profiles(id) on delete cascade,
  child_id uuid references profiles(id) on delete cascade,
  primary key (parent_id, child_id)
);

-- Enable RLS
alter table profiles enable row level security;
alter table courses enable row level security;
alter table enrollments enable row level security;
alter table lessons enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_attempts enable row level security;
alter table resources enable row level security;
alter table sessions enable row level security;
alter table payments enable row level security;
alter table parent_children enable row level security;

-- Simple basic policies for now
-- Profiles
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check ((select auth.uid()) = id);
create policy "Users can update own profile." on profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Courses
create policy "Courses are viewable by everyone." on courses for select using (true);
-- Further policies would be specific to roles (tutors create, etc.)

-- Enrollments
create policy "Users can view their own enrollments." on enrollments for select to authenticated using ((select auth.uid()) = learner_id);
