import React from 'react'

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'primary' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success:  'bg-green-100 text-green-800',
  warning:  'bg-amber-100 text-amber-800',
  error:    'bg-error-container text-on-error-container',
  neutral:  'bg-surface-container text-on-surface-variant',
  primary:  'bg-primary/10 text-primary',
  info:     'bg-tertiary-fixed text-on-tertiary-fixed',
}

export default function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
