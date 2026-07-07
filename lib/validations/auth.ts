import { z } from 'zod'

const INTERESTED_COURSES = [
  'Spoken English',
  'Spoken Hindi',
  'Advanced Hindi',
  'IELTS',
  'TOEFL',
  'Stress Counselling',
] as const

// ── Login ──────────────────────────────────────────────────────
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or mobile is required')
    .refine(
      (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^[6-9]\d{9}$/.test(v),
      'Enter a valid email address or 10-digit mobile number'
    ),
  password: z.string().min(1, 'Password is required'),
})
export type LoginInput = z.infer<typeof loginSchema>

// ── Reset password ────────────────────────────────────────────
export const resetSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})
export type ResetInput = z.infer<typeof resetSchema>

// ── Update password ───────────────────────────────────────────
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>

// ── Common registration fields ────────────────────────────────
const baseRegistrationSchema = {
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms & Conditions to continue' }),
  }),
}

// ── Learner registration ──────────────────────────────────────
export const learnerSignupSchema = z.object({
  ...baseRegistrationSchema,
  interestedCourse: z.enum(INTERESTED_COURSES, {
    errorMap: () => ({ message: 'Please select a course you are interested in' }),
  }),
  // Aadhaar: UI-only masked field. Value is NEVER sent to server.
  // This field tracks whether the user completed the UX step.
  aadhaarAcknowledged: z.boolean().refine((v) => v === true, {
    message: 'Please acknowledge the Aadhaar verification step',
  }),
})
export type LearnerSignupInput = z.infer<typeof learnerSignupSchema>

// ── Tutor registration ────────────────────────────────────────
export const tutorSignupSchema = z.object({
  ...baseRegistrationSchema,
  qualification: z.string().min(2, 'Please provide your highest qualification'),
  experienceYears: z
    .number({ invalid_type_error: 'Enter a valid number' })
    .min(0)
    .max(50),
  subjects: z
    .array(z.string())
    .min(1, 'Select at least one subject you can teach'),
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(1000),
})
export type TutorSignupInput = z.infer<typeof tutorSignupSchema>

// ── Parent registration ───────────────────────────────────────
export const parentSignupSchema = z.object({
  ...baseRegistrationSchema,
  childLinkCode: z.string().optional(),
})
export type ParentSignupInput = z.infer<typeof parentSignupSchema>

export { INTERESTED_COURSES }
