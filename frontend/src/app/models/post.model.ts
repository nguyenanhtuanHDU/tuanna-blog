export interface Post {
  _id: string
  userID: string
  userAvatar: string
  userUsername: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  views: number
  // likers: string[]
  likers: [{
    userLikeID: string
    avatar: string
    username: string,
    createdAt: string
  }],
  tag: string
  images: string[]
  comments: any[]
}
