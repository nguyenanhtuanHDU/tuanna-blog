export interface User {
  _id: string;
  username: string;
  email: string;
  address: string;
  admin: boolean;
  avatar: string
  bgAvatar: string
  gender: string
  fullName: {
    firstName: string,
    lastName: string
  },
  birthday: string,
  listAvatars: string[];
  listBgAvatars: string[];
  listAvatarsDefault: string[];
  listBgAvatarsDefault: string[];
  totalUploadFileSize: number;
  likes: string[];
  notices: any[],
  views: number
  posts: string[]
  createdAt: string
}


