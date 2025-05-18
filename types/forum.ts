export interface ForumUser {
  id: string
  name: string
  avatar: string
  joinDate: string
  postCount: number
  reputation: number
}

export interface ForumComment {
  id: string
  userId: string
  content: string
  createdAt: string
  likes: number
  isEdited: boolean
}

export interface ForumThread {
  id: string
  title: string
  content: string
  userId: string
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  isPinned: boolean
  isLocked: boolean
  category: string
  tags: string[]
  commentCount: number
  comments: ForumComment[]
}

export interface ForumCategory {
  id: string
  name: string
  description: string
  threadCount: number
  lastActivity: string
}
