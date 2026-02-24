import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRef } from 'react'

import type { Id } from '@/convex/_generated/dataModel'
import { useComments } from '@/hooks/use-comments'
import { X } from 'lucide-react'
import { Comment } from './comment'
import { CommentInput } from './input'

type CommentsPanelProps = {
  postId: Id<'posts'>
  open: boolean
  onClose?: () => void
  isDrawer?: boolean
}

export function CommentsPanel({ postId, open, onClose, isDrawer }: CommentsPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    comments,
    threadedComments,
    currentUser,
    scrollRef,
    text,
    setText,
    replyToId,
    setReplyToId,
    handleSubmit,
  } = useComments(postId, open)
  const replyTarget = comments?.find((comment) => comment._id === replyToId)
  const handleReply = (commentId: Id<'comments'>) => {
    setReplyToId(commentId)
    inputRef.current?.focus()
  }

  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full shrink-0 flex-col',
        isDrawer ? 'h-[60vh]' : 'border-t border-border md:w-72 md:border-t-0 md:border-l',
      )}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Comments</h3>
          {onClose && !isDrawer && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-muted-foreground/80"
              onClick={onClose}
              aria-label="Close comments"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable list */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {comments === undefined ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Loading&hellip;</div>
        ) : comments.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No comments yet. Be the first.
          </div>
        ) : (
          <ul className="space-y-3">
            {threadedComments?.map((comment) => (
              <Comment key={comment._id} comment={comment} depth={0} onReply={handleReply} />
            ))}
          </ul>
        )}
      </div>

      {/* Bottom input */}
      <CommentInput
        replyTarget={replyTarget}
        setReplyToId={setReplyToId}
        text={text}
        setText={setText}
        handleSubmit={handleSubmit}
        currentUser={currentUser ?? null}
        inputRef={inputRef}
      />
    </div>
  )
}
