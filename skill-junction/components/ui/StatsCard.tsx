import React from 'react'

interface StatsCardProps {
  icon: string
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  accent?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success'
  className?: string
}

const accentStyles = {
  primary:   { icon: 'bg-primary/10 text-primary', delta: 'bg-green-100 text-green-700' },
  secondary: { icon: 'bg-secondary/10 text-secondary', delta: 'bg-blue-100 text-blue-700' },
  tertiary:  { icon: 'bg-tertiary/10 text-tertiary', delta: 'bg-sky-100 text-sky-700' },
  error:     { icon: 'bg-error/10 text-error', delta: 'bg-red-100 text-red-700' },
  success:   { icon: 'bg-green-100 text-green-700', delta: 'bg-green-100 text-green-700' },
}

export default function StatsCard({
  icon,
  label,
  value,
  delta,
  deltaPositive = true,
  accent = 'primary',
  className = '',
}: StatsCardProps) {
  const styles = accentStyles[accent]

  return (
    <div className={`glass-card p-4 rounded-2xl shadow-sm border border-outline-variant/20 group hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-xl ${styles.icon}`}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
        {delta && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${deltaPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {delta}
          </span>
        )}
      </div>
      <p className="text-xs text-on-surface-variant uppercase tracking-widest opacity-70 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold text-on-surface leading-none">{value}</p>
    </div>
  )
}
