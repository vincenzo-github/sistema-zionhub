'use client'

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconBg: string
  change?: {
    value: string
    trend: 'up' | 'down'
    label: string
  }
}

export function StatCard({ title, value, icon: Icon, iconBg, change }: StatCardProps) {
  return (
    <Card className="transition-all hover:shadow-card-hover hover:-translate-y-1 cursor-pointer">
      <CardContent className="p-6">
        <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-xl', iconBg)}>
          <Icon className="h-6 w-6" />
        </div>

        <p className="text-sm font-medium text-gray-600">{title}</p>

        <p className="mt-2 text-3xl font-bold">{value}</p>

        {change && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span
              className={cn(
                'font-medium',
                change.trend === 'up' ? 'text-success-500' : 'text-error-500'
              )}
            >
              {change.trend === 'up' ? '↑' : '↓'} {change.value}
            </span>
            <span className="text-gray-600">{change.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
