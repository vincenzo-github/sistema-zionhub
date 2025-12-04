'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()
  const { token, hydrate } = useAuthStore()

  useEffect(() => {
    hydrate()

    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [token, router, hydrate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner"></div>
    </div>
  )
}
