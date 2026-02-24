import { useAuth } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect } from 'react'
import { toast } from 'sonner'

import { Footer } from '@/components/footer'
import { Hero } from '@/components/home/hero'

const Grain = lazy(() => import('@/components/bg/grain').then((m) => ({ default: m.Grain })))

export const Route = createFileRoute('/')({ component: IndexComponent })

function IndexComponent() {
  const { isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (isSignedIn) {
      toast.info(`You're signed in, use the feed to explore`)
    }
  }, [isSignedIn])

  if (!isLoaded) {
    return null
  }

  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <Grain />
      </Suspense>
      <Footer />
    </>
  )
}
