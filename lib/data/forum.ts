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
export const forumThreads: ForumThread[] = [
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
