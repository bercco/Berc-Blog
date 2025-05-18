import type { ForumCategory, ForumThread, ForumUser } from "@/types/forum"

export const forumUsers: ForumUser[] = [
  {
    id: "user1",
    name: "TradingMaster",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-01-15",
    postCount: 342,
    reputation: 876,
  },
  {
    id: "user2",
    name: "InvestorPro",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-03-22",
    postCount: 187,
    reputation: 543,
  },
  {
    id: "user3",
    name: "StockAnalyst",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-05-10",
    postCount: 256,
    reputation: 721,
  },
  {
    id: "user4",
    name: "MarketGuru",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-02-05",
    postCount: 412,
    reputation: 932,
  },
  {
    id: "user5",
    name: "CryptoKing",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-04-18",
    postCount: 178,
    reputation: 489,
  },
]

export const forumCategories: ForumCategory[] = [
  {
    id: "cat1",
    name: "Stock Market Strategies",
    description: "Discuss various strategies for stock market trading and investing",
    threadCount: 156,
    lastActivity: "2023-05-15T14:32:00Z",
  },
  {
    id: "cat2",
    name: "Technical Analysis",
    description: "Share and discuss technical analysis methods and indicators",
    threadCount: 98,
    lastActivity: "2023-05-14T18:45:00Z",
  },
  {
    id: "cat3",
    name: "Fundamental Analysis",
    description: "Discuss company fundamentals, financial statements, and valuation methods",
    threadCount: 87,
    lastActivity: "2023-05-15T09:20:00Z",
  },
  {
    id: "cat4",
    name: "Cryptocurrency Trading",
    description: "Strategies and discussions about cryptocurrency markets",
    threadCount: 124,
    lastActivity: "2023-05-15T16:10:00Z",
  },
  {
    id: "cat5",
    name: "Market News & Events",
    description: "Discuss current market news, events, and their potential impact",
    threadCount: 112,
    lastActivity: "2023-05-15T15:30:00Z",
  },
]

export const forumThreads: ForumThread[] = [
  {
    id: "thread1",
    title: "The Ultimate Guide to Moving Average Crossover Strategy",
    content:
      "In this thread, I'll share my comprehensive guide to using moving average crossovers for identifying trend changes and potential entry/exit points. I've been using this strategy for over 5 years with consistent results.",
    userId: "user1",
    createdAt: "2023-05-10T09:15:00Z",
    updatedAt: "2023-05-15T14:32:00Z",
    views: 1245,
    likes: 87,
    isPinned: true,
    isLocked: false,
    category: "cat2",
    tags: ["technical analysis", "moving averages", "strategy", "beginner friendly"],
    commentCount: 42,
    comments: [
      {
        id: "comment1",
        userId: "user3",
        content:
          "Great guide! I've been using a similar strategy but with different period settings. Have you tried using the 9 and 21 EMA combination?",
        createdAt: "2023-05-10T10:30:00Z",
        likes: 12,
        isEdited: false,
      },
      {
        id: "comment2",
        userId: "user2",
        content:
          "This is exactly what I needed as a beginner. The way you explained the concept of crossovers makes it much easier to understand than other guides I've read.",
        createdAt: "2023-05-10T11:45:00Z",
        likes: 8,
        isEdited: false,
      },
    ],
  },
  {
    id: "thread2",
    title: "MACD Divergence: How to Spot Potential Reversals",
    content:
      "MACD divergence is one of the most powerful signals for identifying potential market reversals. In this thread, I'll explain how to spot and trade these divergences effectively.",
    userId: "user4",
    createdAt: "2023-05-12T13:20:00Z",
    updatedAt: "2023-05-15T09:20:00Z",
    views: 876,
    likes: 65,
    isPinned: false,
    isLocked: false,
    category: "cat2",
    tags: ["technical analysis", "MACD", "divergence", "reversal patterns"],
    commentCount: 28,
    comments: [
      {
        id: "comment3",
        userId: "user1",
        content:
          "I've found that combining MACD divergence with RSI confirmation gives even stronger signals. Have you tried this combination?",
        createdAt: "2023-05-12T14:05:00Z",
        likes: 15,
        isEdited: false,
      },
    ],
  },
  {
    id: "thread3",
    title: "Fundamental Analysis: P/E Ratio Isn't Everything",
    content:
      "Many investors rely too heavily on P/E ratios when evaluating stocks. In this thread, I'll discuss why this can be misleading and what other metrics you should consider for a more complete picture.",
    userId: "user3",
    createdAt: "2023-05-08T16:45:00Z",
    updatedAt: "2023-05-14T18:45:00Z",
    views: 1032,
    likes: 92,
    isPinned: false,
    isLocked: false,
    category: "cat3",
    tags: ["fundamental analysis", "valuation", "P/E ratio", "financial metrics"],
    commentCount: 37,
    comments: [
      {
        id: "comment4",
        userId: "user5",
        content:
          "This is so important! I've seen too many beginners make decisions solely based on P/E. I personally prefer using EV/EBITDA for most sectors.",
        createdAt: "2023-05-08T17:30:00Z",
        likes: 21,
        isEdited: false,
      },
    ],
  },
  {
    id: "thread4",
    title: "Bitcoin's Correlation with Tech Stocks: A Changing Relationship",
    content:
      "I've been tracking Bitcoin's correlation with tech stocks over the past 3 years, and I've noticed some interesting patterns. Let's discuss how this relationship is evolving and what it means for diversification.",
    userId: "user5",
    createdAt: "2023-05-14T10:10:00Z",
    updatedAt: "2023-05-15T16:10:00Z",
    views: 754,
    likes: 48,
    isPinned: false,
    isLocked: false,
    category: "cat4",
    tags: ["cryptocurrency", "bitcoin", "correlation", "tech stocks", "diversification"],
    commentCount: 19,
    comments: [
      {
        id: "comment5",
        userId: "user2",
        content:
          "Great analysis! I've noticed similar patterns. It seems like during market stress, the correlation increases significantly.",
        createdAt: "2023-05-14T11:25:00Z",
        likes: 9,
        isEdited: false,
      },
    ],
  },
  {
    id: "thread5",
    title: "Fed Meeting Impact: Preparing Your Portfolio",
    content:
      "With the upcoming Fed meeting, I wanted to start a discussion on how everyone is positioning their portfolios. What sectors do you think will benefit or suffer from potential rate changes?",
    userId: "user2",
    createdAt: "2023-05-13T15:30:00Z",
    updatedAt: "2023-05-15T15:30:00Z",
    views: 892,
    likes: 73,
    isPinned: true,
    isLocked: false,
    category: "cat5",
    tags: ["fed", "interest rates", "portfolio management", "market events"],
    commentCount: 31,
    comments: [
      {
        id: "comment6",
        userId: "user4",
        content:
          "I'm reducing exposure to high-growth tech and increasing positions in utilities and consumer staples. Also keeping some cash ready for opportunities.",
        createdAt: "2023-05-13T16:15:00Z",
        likes: 17,
        isEdited: false,
      },
    ],
  },
]
