import { useUser } from '@clerk/clerk-react'
import { useConvexAuth, useMutation } from 'convex/react'
import { useEffect, useRef } from 'react'
import { api } from '../../convex/_generated/api'

/**
 * Syncs the current Clerk user to Convex when Clerk profile fields change.
 * Mount once inside Convex + Clerk providers.
 * Username is required (Clerk is configured to require username after account creation).
 *
 * Uses Convex's useConvexAuth() so we only call the mutation after the auth token
 * has been fetched and validated by Convex (avoids "Not authenticated" race).
 * @see https://docs.convex.dev/auth/clerk
 * @see https://clerk.com/docs/guides/development/integrations/databases/convex
 */
export function ConvexAuthSync() {
  const { isAuthenticated } = useConvexAuth()
  const { user: clerkUser } = useUser()
  const syncFromClerk = useMutation(api.users.syncFromClerk)
  const lastSyncedKey = useRef<string | null>(null)
  const syncingKey = useRef<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      lastSyncedKey.current = null
      syncingKey.current = null
      return
    }

    if (!clerkUser?.username) return

    const syncKey = `${clerkUser.username}|${clerkUser.fullName}|${clerkUser.imageUrl}`
    if (syncKey === lastSyncedKey.current || syncKey === syncingKey.current) return

    syncingKey.current = syncKey
    syncFromClerk({
      username: clerkUser.username,
      displayName: clerkUser.fullName || undefined,
      avatarUrl: clerkUser.imageUrl,
    })
      .then(() => {
        lastSyncedKey.current = syncKey
      })
      .catch(() => {
        // Allow retry on next render when profile/syncKey changes
      })
      .finally(() => {
        if (syncingKey.current === syncKey) syncingKey.current = null
      })
  }, [
    isAuthenticated,
    clerkUser?.username,
    clerkUser?.fullName,
    clerkUser?.imageUrl,
    syncFromClerk,
  ])

  return null
}
