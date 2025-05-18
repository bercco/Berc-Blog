import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ForumCategory {
  id: number
  name: string
  description: string
  slug: string
  thread_count: number
  last_activity: string
}

export interface ForumThread {
  id: number
  title: string
  content: string
  user_id: string
  category_id: number
  views: number
  likes: number
  is_pinned: boolean
  is_locked: boolean
  created_at: string
  last_activity: string
  comment_count: number
  tags: string[]
  user: {
    username: string
    avatar_url: string | null
  }
  category: {
    name: string
    slug: string
  }
}

export interface ForumComment {
  id: number
  thread_id: number
  user_id: string
  content: string
  likes: number
  is_edited: boolean
  parent_id: number | null
  created_at: string
  user: {
    username: string
    avatar_url: string | null
  }
  replies?: ForumComment[]
}

// Mock forum categories
export const forumCategories: ForumCategory[] = [
  {
    id: 1,
    name: "Stock Market Strategies",
    description: "Discuss various strategies for stock market trading and investing",
    slug: "stock-market-strategies",
    thread_count: 156,
    last_activity: "2023-05-15T14:32:00Z",
  },
  {
    id: 2,
    name: "Technical Analysis",
    description: "Share and discuss technical analysis methods and indicators",
    slug: "technical-analysis",
    thread_count: 98,
    last_activity: "2023-05-14T18:45:00Z",
  },
  {
    id: 3,
    name: "Fundamental Analysis",
    description: "Discuss company fundamentals, financial statements, and valuation methods",
    slug: "fundamental-analysis",
    thread_count: 87,
    last_activity: "2023-05-15T09:20:00Z",
  },
  {
    id: 4,
    name: "Cryptocurrency Trading",
    description: "Strategies and discussions about cryptocurrency markets",
    slug: "cryptocurrency-trading",
    thread_count: 124,
    last_activity: "2023-05-15T16:10:00Z",
  },
  {
    id: 5,
    name: "Market News & Events",
    description: "Discuss current market news, events, and their potential impact",
    slug: "market-news-events",
    thread_count: 112,
    last_activity: "2023-05-15T15:30:00Z",
  },
]

// Mock forum threads
export const initialThreads: ForumThread[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Moving Average Crossover Strategy",
    content:
      "In this thread, I'll share my comprehensive guide to using moving average crossovers for identifying trend changes and potential entry/exit points. I've been using this strategy for over 5 years with consistent results.",
    user_id: "user1",
    category_id: 2,
    views: 1245,
    likes: 87,
    is_pinned: true,
    is_locked: false,
    created_at: "2023-05-10T09:15:00Z",
    last_activity: "2023-05-15T14:32:00Z",
    comment_count: 42,
    tags: ["technical analysis", "moving averages", "strategy", "beginner friendly"],
    user: {
      username: "TradingMaster",
      avatar_url: "/placeholder.svg?height=100&width=100",
    },
    category: {
      name: "Technical Analysis",
      slug: "technical-analysis",
    },
  },
  {
    id: 2,
    title: "MACD Divergence: How to Spot Potential Reversals",
    content:
      "MACD divergence is one of the most powerful signals for identifying potential market reversals. In this thread, I'll explain how to spot and trade these divergences effectively.",
    user_id: "user4",
    category_id: 2,
    views: 876,
    likes: 65,
    is_pinned: false,
    is_locked: false,
    created_at: "2023-05-12T13:20:00Z",
    last_activity: "2023-05-15T09:20:00Z",
    comment_count: 28,
    tags: ["technical analysis", "MACD", "divergence", "reversal patterns"],
    user: {
      username: "MarketGuru",
      avatar_url: "/placeholder.svg?height=100&width=100",
    },
    category: {
      name: "Technical Analysis",
      slug: "technical-analysis",
    },
  },
  {
    id: 3,
    title: "Fundamental Analysis: P/E Ratio Isn't Everything",
    content:
      "Many investors rely too heavily on P/E ratios when evaluating stocks. In this thread, I'll discuss why this can be misleading and what other metrics you should consider for a more complete picture.",
    user_id: "user3",
    category_id: 3,
    views: 1032,
    likes: 92,
    is_pinned: false,
    is_locked: false,
    created_at: "2023-05-08T16:45:00Z",
    last_activity: "2023-05-14T18:45:00Z",
    comment_count: 37,
    tags: ["fundamental analysis", "valuation", "P/E ratio", "financial metrics"],
    user: {
      username: "StockAnalyst",
      avatar_url: "/placeholder.svg?height=100&width=100",
    },
    category: {
      name: "Fundamental Analysis",
      slug: "fundamental-analysis",
    },
  },
]

// Mock forum comments
export const initialComments: ForumComment[] = [
  {
    id: 1,
    thread_id: 1,
    user_id: "user3",
    content:
      "Great guide! I've been using a similar strategy but with different period settings. Have you tried using the 9 and 21 EMA combination?",
    likes: 12,
    is_edited: false,
    parent_id: null,
    created_at: "2023-05-10T10:30:00Z",
    user: {
      username: "StockAnalyst",
      avatar_url: "/placeholder.svg?height=100&width=100",
    },
  },
  {
    id: 2,
    thread_id: 1,
    user_id: "user2",
    content:
      "This is exactly what I needed as a beginner. The way you explained the concept of crossovers makes it much easier to understand than other guides I've read.",
    likes: 8,
    is_edited: false,
    parent_id: null,
    created_at: "2023-05-10T11:45:00Z",
    user: {
      username: "InvestorPro",
      avatar_url: "/placeholder.svg?height=100&width=100",
    },
  },
  {
    id: 3,
    thread_id: 1,
    user_id: "user1",
    content:
      "Thanks for the feedback! Yes, I've experimented with the 9/21 EMA combination and found it works well in trending markets but can give false signals in ranging markets.",
    likes: 5,
    is_edited: false,
    parent_id: 1,
    created_at: "2023-05-10T12:15:00Z",
    user: {
      username: "TradingMaster",
      avatar_url: "/placeholder.svg?height=100&width=100",
    },
  },
]

// Create a store for forum data
interface ForumState {
  threads: ForumThread[]
  comments: ForumComment[]
  addThread: (
    thread: Omit<ForumThread, "id" | "created_at" | "last_activity" | "views" | "likes" | "comment_count">,
  ) => ForumThread
  addComment: (comment: Omit<ForumComment, "id" | "created_at" | "likes" | "is_edited">) => ForumComment
  incrementThreadView: (threadId: number) => void
  likeThread: (threadId: number, userId: string) => void
  likeComment: (commentId: number) => void
  getThreadById: (threadId: number) => ForumThread | undefined
  getThreadsByCategory: (categoryId: number) => ForumThread[]
  getCommentsByThread: (threadId: number) => ForumComment[]
  getThreadLikes: (threadId: number) => string[]
}

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      threads: initialThreads,
      comments: initialComments,
      threadLikes: {} as Record<number, string[]>,

      addThread: (thread) => {
        const newThread = {
          ...thread,
          id: get().threads.length + 1,
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          views: 0,
          likes: 0,
          comment_count: 0,
        }

        set((state) => ({
          threads: [...state.threads, newThread],
        }))

        // Update category thread count
        // In a real app, this would update the category in the database

        return newThread
      },

      addComment: (comment) => {
        const newComment = {
          ...comment,
          id: get().comments.length + 1,
          created_at: new Date().toISOString(),
          likes: 0,
          is_edited: false,
        }

        set((state) => ({
          comments: [...state.comments, newComment],
          threads: state.threads.map((thread) =>
            thread.id === comment.thread_id
              ? {
                  ...thread,
                  comment_count: thread.comment_count + 1,
                  last_activity: new Date().toISOString(),
                }
              : thread,
          ),
        }))

        return newComment
      },

      incrementThreadView: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId ? { ...thread, views: thread.views + 1 } : thread,
          ),
        }))
      },

      likeThread: (threadId, userId) => {
        // Check if user already liked this thread
        const threadLikes = get().threadLikes[threadId] || []
        if (threadLikes.includes(userId)) {
          return // User already liked this thread
        }

        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId ? { ...thread, likes: thread.likes + 1 } : thread,
          ),
          threadLikes: {
            ...state.threadLikes,
            [threadId]: [...threadLikes, userId],
          },
        }))
      },

      likeComment: (commentId) => {
        set((state) => ({
          comments: state.comments.map((comment) =>
            comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
          ),
        }))
      },

      getThreadById: (threadId) => {
        return get().threads.find((thread) => thread.id === threadId)
      },

      getThreadsByCategory: (categoryId) => {
        return get().threads.filter((thread) => thread.category_id === categoryId)
      },

      getCommentsByThread: (threadId) => {
        return get().comments.filter((comment) => comment.thread_id === threadId)
      },

      getThreadLikes: (threadId) => {
        return get().threadLikes[threadId] || []
      },
    }),
    {
      name: "forum-storage",
    },
  ),
)

// Function to get a category by ID or slug
export function getCategoryById(id: number): ForumCategory | undefined {
  return forumCategories.find((category) => category.id === id)
}

export function getCategoryBySlug(slug: string): ForumCategory | undefined {
  return forumCategories.find((category) => category.slug === slug)
}

// Function to organize comments into a threaded structure
export function organizeComments(comments: ForumComment[]): ForumComment[] {
  const parentComments: ForumComment[] = []
  const childComments: Record<number, ForumComment[]> = {}

  // Separate parent and child comments
  comments.forEach((comment) => {
    if (comment.parent_id === null) {
      parentComments.push({ ...comment, replies: [] })
    } else {
      if (!childComments[comment.parent_id]) {
        childComments[comment.parent_id] = []
      }
      childComments[comment.parent_id].push(comment)
    }
  })

  // Attach child comments to their parents
  parentComments.forEach((comment) => {
    if (childComments[comment.id]) {
      comment.replies = childComments[comment.id]
    }
  })

  return parentComments
}
