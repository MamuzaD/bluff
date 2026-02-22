import { Globe2, UsersRound } from 'lucide-react'

type FeedScope = 'global' | 'friends'

interface FeedScopeTabsProps {
  scope: FeedScope
  onScopeChange: (scope: FeedScope) => void
}

function FeedScopeTabsPill({
  scope,
  onScopeChange,
}: Pick<FeedScopeTabsProps, 'scope' | 'onScopeChange'>) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/70 p-1 backdrop-blur-sm">
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          scope === 'global'
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        onClick={() => onScopeChange('global')}
      >
        <Globe2 className="size-4" />
        Global
      </button>
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          scope === 'friends'
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        onClick={() => onScopeChange('friends')}
      >
        <UsersRound className="size-4" />
        Friends
      </button>
    </div>
  )
}

export function FeedScopeTabs({ scope, onScopeChange }: FeedScopeTabsProps) {
  return (
    <div className="sticky top-25 z-65 flex justify-center">
      <FeedScopeTabsPill scope={scope} onScopeChange={onScopeChange} />
    </div>
  )
}
