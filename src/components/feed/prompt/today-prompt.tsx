import type { ReactNode } from 'react'

import { Separator } from '@/components/ui/separator'
import type { RoundSchedule } from '@/hooks/use-prompt-schedule'
import { usePromptSchedule } from '@/hooks/use-prompt-schedule'
import { cn } from '@/lib/utils'

import { JokerBubble } from './joker-bubble'

export type { RoundSchedule }

export type FloatingHeaderOverride = {
  challengeLabel: string
  prompt: string
  statusLine: string
}

interface TodayPromptProps {
  prompt: string
  /** When provided (e.g. from backend), used instead of computing from schedule. */
  statusLine?: string | null
  /** When provided (e.g. from backend), used instead of computing from schedule. */
  challengeLabel?: string | null
  schedule?: RoundSchedule | null
  action?: ReactNode
  /** When provided, the card shows this instead of the main prompt (e.g. scroll-synced section). */
  floatingHeaderOverride?: FloatingHeaderOverride | null
  suspendSticky?: boolean
}

export function TodayPrompt({
  prompt,
  statusLine: statusLineProp,
  challengeLabel: challengeLabelProp,
  schedule,
  action,
  floatingHeaderOverride,
  suspendSticky = false,
}: TodayPromptProps) {
  const scheduleDerived = usePromptSchedule(
    statusLineProp != null && challengeLabelProp != null ? null : schedule,
  )
  const statusLine = statusLineProp ?? scheduleDerived.statusLine
  const challengeLabel = challengeLabelProp ?? scheduleDerived.challengeLabel

  const displayLabel = floatingHeaderOverride?.challengeLabel ?? challengeLabel
  const displayPrompt = floatingHeaderOverride?.prompt ?? prompt
  const displayStatusLine = floatingHeaderOverride?.statusLine ?? statusLine

  return (
    <section
      className={cn(
        'relative mx-auto max-w-md overflow-hidden rounded-xl border border-primary/20 bg-card p-4 shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_12%,transparent)]',
        suspendSticky ? 'z-0' : 'sticky top-2 z-60',
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_18%,transparent)_0%,transparent_70%)]" />
      <div className="relative flex items-center gap-3">
        <JokerBubble className="size-12 shrink-0 text-xl self-center" />
        <Separator orientation="vertical" className="shrink-0 self-stretch" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[color-mix(in_oklch,var(--primary)_75%,white)]">
            {displayLabel}
          </p>
          <p className="mt-0.5 font-medium leading-snug">{displayPrompt}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{displayStatusLine}</p>
        </div>
        {action != null && (
          <>
            <Separator orientation="vertical" className="shrink-0 self-stretch" />
            {action}
          </>
        )}
      </div>
    </section>
  )
}
