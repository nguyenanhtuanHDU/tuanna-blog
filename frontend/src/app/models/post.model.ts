export interface Post {
  _id: string
  userID: string
  userAvatar: string
  userUsername: string
  title: string
  content: string
  createdAt: string
  views: number
  likers: string[]
  tag: string
  images: string[]
  // comments:string[] -> chưa phát triển
}
