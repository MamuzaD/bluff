import { env } from '@/env'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { ConvexAuthSync } from '@/components/convex-auth-sync'
import { RootError } from '@/components/error'
import Header from '@/components/header'
import { NotFound } from '@/components/not-found'
import { UserProvider } from '@/contexts/user-context'
import ConvexProvider from '@/integrations/convex/provider'

import ClerkProvider from '@/integrations/clerk/provider'

import TanStackQueryProvider from '@/integrations/tanstack-query/provider'

import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'

import appCss from '@/styles.css?url'

import { ThemeProvider } from '@/components/theme/provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // Protected routes use RequireAuth in _app (see Authenticated Routes: React context/hooks).
  notFoundComponent: NotFound,
  errorComponent: RootError,
  head: () => {
    const title = 'Bluff'
    const description = 'Bluff. WIP.'
    const siteName = 'Bluff'
    const imagePath = '/opengraph/landing.jpg'
    const baseUrl = env.VITE_SITE_URL ? env.VITE_SITE_URL.replace(/\/$/, '') : ''
    const imageUrl = baseUrl ? `${baseUrl}${imagePath}` : imagePath

    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title,
        },
        { name: 'description', content: description },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: `${siteName} — ${description}` },
        ...(baseUrl ? ([{ property: 'og:url', content: baseUrl }] as const) : []),
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: imageUrl },
        { name: 'twitter:image:alt', content: `${siteName} — ${description}` },
      ],
      links: [
        // Favicons
        { rel: 'icon', href: '/favicon/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/favicon/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
        { rel: 'icon', href: '/favicon/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png', sizes: '180x180' },
        {
          rel: 'icon',
          href: '/favicon/android-chrome-192x192.png',
          type: 'image/png',
          sizes: '192x192',
        },
        {
          rel: 'icon',
          href: '/favicon/android-chrome-512x512.png',
          type: 'image/png',
          sizes: '512x512',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Sofia+Sans:ital,wght@0,1..1000;1,1..1000&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DynaPuff:wght@400..700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: appCss,
        },
      ],
    }
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <ConvexProvider>
            <TanStackQueryProvider>
              <UserProvider>
                <ThemeProvider>
                  <TooltipProvider>
                    <ConvexAuthSync />
                    <Header />
                    {/* always have the same gap on sides */}
                    <main className="relative pt-32 px-6 md:px-16 mx-auto max-w-screen-2xl">
                      {children}
                    </main>
                    <Toaster />
                    {/* tanstack dev tools */}
                    <TanStackDevtools
                      config={{
                        position: 'bottom-left',
                      }}
                      plugins={[
                        {
                          name: 'Tanstack Router',
                          render: <TanStackRouterDevtoolsPanel />,
                        },
                        TanStackQueryDevtools,
                      ]}
                    />
                  </TooltipProvider>
                </ThemeProvider>
              </UserProvider>
            </TanStackQueryProvider>
          </ConvexProvider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}
