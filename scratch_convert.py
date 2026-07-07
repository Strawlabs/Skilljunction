import re
import os
import textwrap

def convert():
    with open(r'c:\Users\navi1\OneDrive\Desktop\Projects\Skill Junction\skill-junction\stitch screens\tutoronboarding.html', 'r', encoding='utf-8') as f:
        tutor_html = f.read()

    # Extract body
    tutor_body = re.search(r'<body[^>]*>(.*)</body>', tutor_html, re.DOTALL).group(1)

    # Convert class to className
    tutor_jsx = tutor_body.replace('class=', 'className=')
    tutor_jsx = tutor_jsx.replace('style="font-variation-settings: \'FILL\' 1;"', 'style={{ fontVariationSettings: "\'FILL\' 1" }}')
    tutor_jsx = tutor_jsx.replace(
        'style="background-image: url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuBRNalgf99scjLCYMU8o1PJtruR0ymasZ8rwQsjQaADRjzdIT8j5oB-HrPzgx0-SpEAugIaiSZUo2jHn5traW38dGEM2rLfq3VKoAqY7QHporGe4pP8C8lxG5QpD9kR9zuWUV3SjN_U0zn04f7BmSDkqZkZkTddX2FERX64UK7iUNqtSQlks0UusAnCw44Da25FXF1UXNxC-BJK-wVKmZA0DnQLpLDg-KfgfUX75gbfoMPRP-9_cPnLcAzQ5yvdcdPhRL3s--Pu9t-8\')"', 
        'style={{ backgroundImage: "url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuBRNalgf99scjLCYMU8o1PJtruR0ymasZ8rwQsjQaADRjzdIT8j5oB-HrPzgx0-SpEAugIaiSZUo2jHn5traW38dGEM2rLfq3VKoAqY7QHporGe4pP8C8lxG5QpD9kR9zuWUV3SjN_U0zn04f7BmSDkqZkZkTddX2FERX64UK7iUNqtSQlks0UusAnCw44Da25FXF1UXNxC-BJK-wVKmZA0DnQLpLDg-KfgfUX75gbfoMPRP-9_cPnLcAzQ5yvdcdPhRL3s--Pu9t-8\')" }}'
    )
    tutor_jsx = tutor_jsx.replace('<!--', '{/*')
    tutor_jsx = tutor_jsx.replace('-->', '*/}')
    tutor_jsx = re.sub(r'<script.*?</script>', '', tutor_jsx, flags=re.DOTALL)

    with open(r'c:\Users\navi1\OneDrive\Desktop\Projects\Skill Junction\app\auth\signup\page.tsx', 'r', encoding='utf-8') as f:
        learner_page = f.read()

    # I want to extract the main return statement of LearnerOnboarding
    # It is the very LAST return statement in the file before the end of the component
    parts = learner_page.split('  return (')
    learner_body = '  return (' + parts[-1].rsplit(')', 1)[0] + ')'

    # Also grab the logic part of LearnerOnboarding
    logic_part = learner_page.split('export default function RegistrationPage() {')[1].split('  return (')[0].split('  if (success) {')[0]
    logic_part = logic_part + """  if (success) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center font-sans p-4">
        <div className="bg-surface-container-low rounded-2xl p-8 max-w-md w-full text-center border border-outline-variant/30">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-container text-primary mb-6 animate-bounce">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="text-headline-lg font-bold text-on-background mb-3">Registration Complete!</h2>
          <p className="text-on-surface-variant text-body-md mb-6">
            Welcome to your Learning Journey. Your profile has been set up successfully.
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }
"""

    new_page = f"""'use client'

import {{ useState, Suspense }} from 'react'
import {{ useSearchParams }} from 'next/navigation'
import {{ useForm }} from 'react-hook-form'
import {{ zodResolver }} from '@hookform/resolvers/zod'
import {{ z }} from 'zod'
import Link from 'next/link'
import {{ INTERESTED_COURSES }} from '@/lib/validations/auth'
import {{ createClient }} from '@/lib/supabase/client'

// Learner Registration Schema
const registrationSchema = z.object({{
  learnerName: z.string().min(2, 'Learner name must be at least 2 characters').max(100),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters').max(100),
  mobile: z.string().regex(/^[6-9]\\d{{9}}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  interestedCourse: z.enum(INTERESTED_COURSES as [string, ...string[]], {{
    errorMap: () => ({{ message: 'Please select a course' }}),
  }}),
  profilePhoto: z.any().optional(),
  aadhaar: z.string().min(1, 'Aadhaar is required for verification (will not be stored)'),
  termsAccepted: z.literal(true, {{
    errorMap: () => ({{ message: 'You must accept the Terms & Conditions' }}),
  }}),
}})

type RegistrationInput = z.infer<typeof registrationSchema>

function LearnerOnboarding() {{
{logic_part}
{learner_body}
}}

function TutorOnboarding() {{
  return (
    <div className="text-on-surface bg-background font-sans">
      {tutor_jsx}
    </div>
  )
}}

function RegisterContent() {{
  const searchParams = useSearchParams()
  const role = searchParams.get('role')

  if (role === 'tutor') {{
    return <TutorOnboarding />
  }}

  return <LearnerOnboarding />
}}

export default function RegisterPage() {{
  return (
    <Suspense fallback={{
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }}>
      <RegisterContent />
    </Suspense>
  )
}}
"""

    new_page = new_page.replace('<img>', '<img />')
    new_page = new_page.replace('<br>', '<br />')
    new_page = new_page.replace('<hr>', '<hr />')

    os.makedirs(r'c:\Users\navi1\OneDrive\Desktop\Projects\Skill Junction\app\register', exist_ok=True)
    with open(r'c:\Users\navi1\OneDrive\Desktop\Projects\Skill Junction\app\register\page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_page)

convert()
