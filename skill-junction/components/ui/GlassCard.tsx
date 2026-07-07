import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  accentLeft?: 'primary' | 'error' | 'success' | 'warning' | 'tertiary'
  hover?: boolean
  padding?: string
}

const accentColors = {
  primary: 'border-l-primary',
  error: 'border-l-error',
  success: 'border-l-green-500',
  warning: 'border-l-amber-500',
  tertiary: 'border-l-tertiary',
}

export default function GlassCard({
  children,
  className = '',
  accentLeft,
  hover = false,
  padding = 'p-6',
}: GlassCardProps) {
  return (
    <div
      className={`
        glass-card rounded-2xl shadow-sm border border-outline-variant/20
        ${accentLeft ? `border-l-4 ${accentColors[accentLeft]}` : ''}
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-300' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
