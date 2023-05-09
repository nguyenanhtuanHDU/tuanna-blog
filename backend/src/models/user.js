const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    fullName: {
      firstName: String,
      lastName: String
    },
    admin: {
      type: Boolean,
      default: true,
    },
    gender: { type: String, enum: ['male', 'female'] },
    birthday: String,
    address: {
      type: String,
    },
    avatar: {
      default: 'avatar-default.png',
      type: String,
    },
    listAvatars: {
      type: Array,
      default: [],
    },
    listAvatarsDefault: {
      type: Array,
      default: [
        'avatar-default.png',
        'avatar-default-2.png',
        'avatar-default-3.png',
        'avatar-default-4.png',
      ],
    },
    bgAvatar: {
      default: 'bg-avatar-default.jpg',
      type: String,
    },
    listBgAvatars: {
      type: Array,
      default: [],
    },
    listBgAvatarsDefault: {
      type: Array,
      default: [
        'bg-avatar-default.jpg',
        'bg-avatar-default-2.jpg',
        'bg-avatar-default-3.jpg',
        'bg-avatar-default-4.jpg',
        'bg-avatar-default-5.jpg',
        'bg-avatar-default-6.jpg',
        'bg-avatar-default-7.jpg',
        'bg-avatar-default-8.jpg',
      ],
    },
    editCount: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    totalUploadFileSize: {
      type: Number,
      default: 0,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    follow: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    likes: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('user', userSchema);

module.exports = User;
