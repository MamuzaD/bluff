import type { PostCardData } from '@/components/feed/post'
import { Post } from '@/components/feed/post'
import { CommentsPanel } from '@/components/feed/post/comment/comments-panel'
import type { ReactionType } from '@/components/feed/post/reactions'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useUser } from '@/hooks/use-user'
import type { PublicPost } from '@/lib/post'
import { timeAgo } from '@/lib/time'
import { cn } from '@/lib/utils'
import { useQuery } from 'convex/react'
import { useState } from 'react'

type FeedPostCardProps = {
  post: PublicPost
  isVotingOpen?: boolean
  onVote: (postId: Id<'posts'>, guess: 'truth' | 'bluff', wager: number) => void
  onReact: (postId: Id<'posts'>, reactionType: ReactionType) => void
}

export function FeedPostCard({ post, isVotingOpen, onVote, onReact }: FeedPostCardProps) {
  const { userId: currentUserId } = useUser()
  const isMobile = useIsMobile()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const author = useQuery(api.users.getById, { userId: post.authorId })
  const imageUrl = useQuery(api.files.getUrl, {
    storageId: post.imageStorageId,
  })
  const voteCount = useQuery(api.votes.countForPost, { postId: post._id }) ?? 0
  const myVote = useQuery(api.votes.getMyVote, { postId: post._id })
  const reactionCounts = useQuery(api.reactions.getCountsByPost, {
    postId: post._id,
  })
  const myReaction = useQuery(api.reactions.getMyReaction, {
    postId: post._id,
  })
  const commentCount = useQuery(api.comments.countByPost, { postId: post._id }) ?? 0

  if (author === undefined || imageUrl === undefined) {
    return (
      <div className="flex w-full justify-center">
        <article className="h-96 w-full shrink-0 animate-pulse rounded-2xl bg-muted/50 md:w-md" />
      </div>
    )
  }

  const cardData: PostCardData = {
    id: post._id,
    authorName: author?.displayName ?? 'Unknown',
    authorHandle: author?.username,
    authorAvatar: author?.avatarUrl,
    timeAgo: timeAgo(post._creationTime),
    imageUrl: imageUrl ?? '',
    caption: post.caption,
    voteCount,
    hasVoted: myVote != null,
    myGuess: myVote?.guess,
    myWager: myVote?.wager,
    reactionCounts: reactionCounts ?? undefined,
    myReaction: myReaction?.reactionType ?? null,
    isRevealed: post.isRevealed,
    isTruth: post.isRevealed ? post.actual === 'truth' : undefined,
    isVotingOpen: isVotingOpen ?? true,
    isOwnPost: currentUserId != null && post.authorId === currentUserId,
  }

  return (
    <div className="flex w-full justify-center">
      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-all duration-300 md:flex-row w-full md:w-fit">
        <div className="w-full shrink-0 md:w-md">
          <Post
            post={cardData}
            postId={post._id}
            onVote={(id, guess, wager) => onVote(id as Id<'posts'>, guess, wager)}
            onReact={(id, reactionType) => onReact(id as Id<'posts'>, reactionType)}
            commentCount={commentCount}
            commentsOpen={commentsOpen}
            onToggleComments={() => setCommentsOpen((prev) => !prev)}
          />
        </div>

        {/* Desktop: width placeholder expands the card horizontally */}
        <div
          className={cn(
            'hidden shrink-0 transition-all duration-300 md:block',
            commentsOpen ? 'md:w-72' : 'md:w-0',
          )}
        />

        {/* Desktop: absolute panel alongside the post */}
        <div
          className={cn(
            'hidden overflow-hidden transition-all duration-300 md:absolute md:inset-y-0 md:right-0 md:block',
            commentsOpen ? 'md:w-72' : 'md:w-0',
          )}
        >
          <CommentsPanel
            postId={post._id}
            open={commentsOpen}
            onClose={() => setCommentsOpen(false)}
          />
        </div>
      </div>

      {/* Mobile: Drawer for comments */}
      {isMobile && (
        <Drawer open={commentsOpen} onOpenChange={setCommentsOpen}>
          <DrawerContent>
            <DrawerHeader className="sr-only">
              <DrawerTitle>Comments</DrawerTitle>
            </DrawerHeader>
            <div className="max-h-[80vh]">
              <CommentsPanel
                postId={post._id}
                open={commentsOpen}
                onClose={() => setCommentsOpen(false)}
                isDrawer
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}
