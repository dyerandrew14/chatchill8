"use client"

interface VideoOverlayActionsProps {
  onThumbsUp: () => void
  onThumbsDown: () => void
  onViewProfile: () => void
  onSuperLike?: (username: string) => void
  onUpgrade?: () => void
  onUseFreeSuper?: () => void
  username?: string
  isVIP?: boolean
  freeSuperLikes?: number
  isDatingMode?: boolean
}

export function VideoOverlayActions({
  onThumbsUp,
  onThumbsDown,
  onViewProfile,
  onSuperLike,
  onUpgrade,
  onUseFreeSuper,
  username = "Stranger",
  isVIP = false,
  freeSuperLikes = 0,
  isDatingMode = false,
}: VideoOverlayActionsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
      {/* Super Like Button - Only shown in dating mode */}
      {isDatingMode && onSuperLike && (
        <button
          onClick={() => {
            if (isVIP || freeSuperLikes > 0) {
              onSuperLike(username)
              if (!isVIP && onUseFreeSuper) {
                onUseFreeSuper()
              }
            } else {
              onUpgrade?.()
            }
          }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg transition-transform hover:scale-110"
          title={isVIP ? "Super Like" : `Super Like (${freeSuperLikes} remaining)`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      )}

      <button
        onClick={onThumbsUp}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-transform hover:scale-110"
        title="Thumbs Up"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
      </button>

      <button
        onClick={onThumbsDown}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-transform hover:scale-110"
        title="Thumbs Down"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
        </svg>
      </button>

      <button
        onClick={onViewProfile}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-transform hover:scale-110"
        title="View Profile"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
    </div>
  )
}
