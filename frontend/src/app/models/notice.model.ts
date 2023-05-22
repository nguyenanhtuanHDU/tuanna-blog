export interface Notice {
  userSend: {
    id: string,
    username: string,
    avatar: string
  },
  userGet: {
    id: string,
  },
  type: string
  content: string,
  updatedAt: string
  isRead: boolean,
  isClick: boolean,
  postID: string
}
