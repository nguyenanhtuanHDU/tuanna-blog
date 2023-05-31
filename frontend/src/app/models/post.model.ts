export interface Post {
  _id: string
  author: {
    _id: string
    avatar: string,
    username: string
  }
  title: string
  content: string
  createdAt: string
  updatedAt: string
  views: number
  // likers: string[]
  likers: [{
    _id: string
    avatar: string
    username: string,
    createdAt: string
  }],
  tag: string
  images: string[]
  comments: any[]
}
