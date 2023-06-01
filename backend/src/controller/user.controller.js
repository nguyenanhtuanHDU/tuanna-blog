const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fs = require('fs');
const Post = require("../models/post");
const bcrypt = require('bcrypt');
const client = require("../config/redis");
const { createNotice } = require("../services/notice.services");
const { getUserRedis, setUserRedis, getListUser } = require("../services/user.services");
const { deleteFiles } = require("../services/file.services");
const Comment = require("../models/comment");
const Notice = require("../models/notice");
const { log } = require("console");

module.exports = {

  clearRedis: async (req, res) => {
    console.log('clear redis');
    await setUserRedis('')
    console.log(getUserRedis());
    res.status(200).json({
      msg: 'clear done'
    });
  },
  getRedis: async (req, res) => {
    const data = await client.get(process.env.REDIS_USER)
    res.status(200).json({
      data
    });
  },
  getUserInfo: async (req, res) => {
    try {
      const accessToken = req.headers.token.split(' ')[1];
      const userDecoded = jwt.verify(accessToken, process.env.TOKEN_KEY);
      const user = await User.findById(userDecoded._id).populate('notices')
      const { password, ...data } = await getUserRedis()
      res.status(200).json({
        data
      });

    } catch (error) {
      console.log(error);
      return res.status(404).json({
        EC: -1,
        msg: 'Server error',
      });
    }
  },
  getUserByID: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password')
      const userRedis = await getUserRedis()
      if (user._id.toString() !== userRedis._id) {
        user.views = user.views + 1
        user.save()
      }
      res.status(200).json({
        data: user
      });

    } catch (error) {
      console.log(error);
      return res.status(404).json({
        EC: -1,
        msg: 'Server error',
      });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json({
        EC: 0,
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        EC: -1,
        data: null,
      });
    }
  },
  getListAdmins: async (req, res) => {
    try {
      const admins = await getListUser(true)
      res.status(200).json({
        EC: 0,
        data: admins,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        EC: -1,
        data: null,
      });
    }
  },
  getNonAdminUsers: async (req, res) => {
    try {
      const users = await getListUser(false)
      res.status(200).json({
        EC: 0,
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        EC: -1,
        data: null,
      });
    }
  },
  postCreateAUser: async (req, res) => {
    try {
      const data = req.body;
      const user = await User.create(data);
    } catch (error) {
      console.log(error);
    }
  },
  putUpdateUserInfo: async (req, res) => {
    try {
      const data = req.body;
      const token = req.headers.token;
      const accessToken = token.split(' ')[1];
      const userDecoded = jwt.verify(accessToken, process.env.TOKEN_KEY);
      const user = await User.findById(userDecoded.id)
      const userInfoArr = await getUserRedis()
      data.editCount = user.editCount + 1;
      for (let key in userInfoArr) {
        if (data.hasOwnProperty(key)) {
          userInfoArr[key] = data[key]
        }
      }
      await client.set(process.env.REDIS_USER, JSON.stringify(userInfoArr));

      await User.updateOne({ _id: userDecoded.id }, data);
      return res.status(200).json({
        msg: 'Update user successfully',
      })
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Server error',
      });
    }
  },
  putUpdateUserInfoByAdmin: async (req, res) => {
    try {
      const userID = req.params.id
      await User.findByIdAndUpdate(userID, req.body)
      return res.status(200).json({
        msg: 'Update user successfully',
      })
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Server error',
      });
    }
  },
  putUpdateUserPassword: async (req, res) => {
    try {
      const userID = req.params.id
      const { oldPassword, newPassword } = req.body
      const user = await User.findById(userID)
      const checkPW = await bcrypt.compareSync(oldPassword, user.password);
      if (!checkPW) {
        res.status(401).json({
          EC: -1,
          msg: 'Incorrect password'
        })
        return
      }
      const salt = await bcrypt.genSaltSync(10);
      const updatePassword = await bcrypt.hashSync(newPassword, salt);
      user.password = updatePassword
      await user.save()
      res.status(200).json({
        msg: 'Update new password successfully',
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Server error',
      });
    }
  },
  putUpdateUserLikes: async (req, res) => {
    try {
      console.log('run');
      const data = req.body
      const userRedis = await getUserRedis()
      const post = await Post.findById(data.idPost)

      if (!userRedis.likes.includes(data.idPost) && data.like == true) {
        userRedis.likes.push(data.idPost)
        post.likers.push(userRedis._id)
        const notice = await createNotice(
          userRedis._id,
          {
            id: post.author._id
          }, 'like', post._id)
        const user = await User.findById(post.author._id)
        if (userRedis._id !== post.author._id && notice) {
          user.notices.push(notice._id)
          await user.save()
        }
        io.on('connection', socket => {
          socket.on('notice', (data) => {
            io.emit('notice', notice)
          })
        });
      } else if (userRedis.likes.includes(data.idPost) && data.like == false) {
        console.log('>>> huy like');
        userRedis.likes.splice(userRedis.likes.indexOf(data.idPost), 1)
        post.likers.map((item, index) => {
          if (item._id.toString() === userRedis._id) {
            post.likers.splice(index, 1)
            return
          }
        })
      }
      await client.set(process.env.REDIS_USER, JSON.stringify(userRedis));
      await post.save()
      await User.findByIdAndUpdate(userRedis._id, { likes: userRedis.likes })
      res.status(200).json({
        EC: 0,
        msg: 'Success'
      })
    } catch (error) {
      console.log(`🚀 ~ error:`, error)
      res.status(404).json({
        msg: 'Server error',
      });
    }

  },
  putUpdateUserAvatar: async (req, res) => {
    try {
      const avatar = req.body.avatar;
      const id = req.params.id;
      const user = await User.findById(id);
      const userRedis = await getUserRedis()
      if (user.avatar === avatar) {
        res.status(400).json({
          msg: 'Please choose another image !',
        });
      } else {
        userRedis.avatar = avatar
        await Post.updateMany({ userID: id }, { userAvatar: avatar })
        await client.set(process.env.REDIS_USER, JSON.stringify(userRedis))
        await User.findByIdAndUpdate(id, { avatar });
        res.status(200).json({
          msg: 'Update avatar successfully ! ',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Server error',
      });
    }
  },
  deleteAvatar: async (req, res) => {
    try {
      let msgError = '';
      const { id, avatar } = req.params;
      const user = await User.findById(id);
      const userRedis = await getUserRedis()
      user.listAvatars.map(async (avatarItem) => {
        if (avatarItem === avatar) {
          if (user.avatar === avatar) {
            userRedis.avatar = 'avatar-default.png'
            await client.set(process.env.REDIS_USER, JSON.stringify(userRedis))
            await User.updateOne({ id }, { avatar: 'avatar-default.png' });
          }
        }
      });
      fs.stat('./src/public/images/avatars/' + avatar, async (err, stats) => {
        if (err) {
          console.error(err);
          msgError = 'Can not find the avatar ! ';
        } else {
          userRedis.totalUploadFileSize = user.totalUploadFileSize - stats.size
          await client.set(process.env.REDIS_USER, JSON.stringify(userRedis))
          await User.findByIdAndUpdate(id, {
            totalUploadFileSize: user.totalUploadFileSize - stats.size,
          });
        }
      });

      fs.unlink('./src/public/images/avatars/' + avatar, async (error) => {
        if (error) {
          console.log(error);
          msgError = 'Delete avatar failed ! ';
        } else {
          userRedis.listAvatars.splice(userRedis.listAvatars.indexOf(avatar), 1);
          await client.set(process.env.REDIS_USER, JSON.stringify(userRedis))
          user.listAvatars.splice(user.listAvatars.indexOf(avatar), 1);
          user.save();
        }
      });
      if (msgError) {
        return res.status(404).json({
          msg: msgError,
        });
      } else {
        return res.status(200).json({
          msg: 'Delete avatar successfully ! ',
        });
      }
    } catch (error) {
      res.status(404).json({
        msg: 'Server error',
      });
    }
  },
  postUpdateUserBg: async (req, res) => {
    try {
      const bgAvatar = req.body.bgAvatar;
      const id = req.params.id;
      const userRedis = await getUserRedis()
      if (userRedis.bgAvatar === bgAvatar) {
        res.status(400).json({
          msg: 'Please choose another image !',
        });
      } else {
        userRedis.bgAvatar = bgAvatar
        await client.set(process.env.REDIS_USER, JSON.stringify(userRedis))
        await User.findByIdAndUpdate(id, { bgAvatar });
        res.status(200).json({
          msg: 'Update background successfully ! ',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Server error',
      });
    }
  },
  deleteBgAvatars: async (req, res) => {
    try {
      let msgError = '';
      const { id, bgAvatar } = req.params;
      const user = await User.findById(id);
      const userRedis = await getUserRedis()
      user.listBgAvatars.map(async (bgItem) => {
        if (bgItem === bgAvatar) {
          if (user.bgAvatar === bgAvatar) {
            userRedis.bgAvatar = bgAvatar
            await client.set(process.env.REDIS_USER, JSON.stringify(userRedis))
            await User.updateOne({ id }, { bgAvatar: 'avatar-default.png' });
          }
        }
      });
      fs.stat(
        './src/public/images/bg-avatars/' + bgAvatar,
        async (err, stats) => {
          if (err) {
            console.error(err);
            msgError = 'Can not find the background ! ';
          } else {
            userRedis.totalUploadFileSize = user.totalUploadFileSize - stats.size
            await client.set(process.env.REDIS_USER, JSON.stringify(userRedis))
            await User.findByIdAndUpdate(id, {
              totalUploadFileSize: user.totalUploadFileSize - stats.size,
            });
          }
        }
      );

      fs.unlink('./src/public/images/bg-avatars/' + bgAvatar, async (error) => {
        if (error) {
          console.log(error);
          msgError = 'Delete background avatar failed ! ';
        } else {
          userRedis.listBgAvatars.splice(userRedis.listBgAvatars.indexOf(bgAvatar), 1);
          await client.set(process.env.REDIS_USER, JSON.stringify(userRedis))
          user.listBgAvatars.splice(user.listBgAvatars.indexOf(bgAvatar), 1);
          user.save();
        }
      });
      if (msgError) {
        return res.status(404).json({
          msg: msgError,
        });
      } else {
        return res.status(200).json({
          msg: 'Delete background avatar successfully ! ',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Server error',
      });
    }
  },
  deleteUserByID: async (req, res) => {
    try {
      const userID = req.params.id
      const user = await User.findByIdAndDelete(userID)
      await Comment.deleteMany({ author: userID })
      await Post.deleteMany({ author: userID })
      await Notice.deleteMany({ userSend: userID })
      await deleteFiles(user.listAvatars)
      await deleteFiles(user.listBgAvatars)
      return res.status(200).json({
        msg: 'Delete user successfully ! ',
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Server error',
      });
    }
  }
};
