const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fs = require('fs');
const client = require('../config/redis');
const Post = require("../models/post");

module.exports = {

  clearRedis: async (req, res) => {
    console.log('clear redis');
    await client.set(process.env.REDIS_USER, '')
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
      const usersInfoStr = await client.get(process.env.REDIS_USER);

      const { password, ...data } = JSON.parse(usersInfoStr)
      res.status(200).json({
        data
      });

    } catch (error) {
      console.log(error);
      return res.status(404).json({
        EC: -1,
        msg: 'Server error !',
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
      console.log(error, 'a');
      res.status(404).json({
        EC: -1,
        data: null,
      });
    }
  },
  getListAvatars: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      console.log("👉👉👉 ~ user:", user.listAvatars)
      res.status(200).json({
        EC: 0,
        data: user.listAvatars,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        EC: -1,
        msg: 'Sever error !',
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
      const userInfoStr = await client.get(process.env.REDIS_USER);
      const userInfoArr = JSON.parse(userInfoStr)
      data.editCount = user.editCount + 1;
      for (let key in userInfoArr) {
        if (data.hasOwnProperty(key)) {
          userInfoArr[key] = data[key]
        }
      }
      await client.set(process.env.REDIS_USER, JSON.stringify(userInfoArr));

      await User.updateOne({ _id: userDecoded.id }, data);
      return res.status(200).json({
        msg: 'You have successfully updated your information !',
      })
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Server error ! ',
      });
    }
  },
  putUpdateUserLikes: async (req, res) => {
    try {

      const data = req.body
      const userRedisStr = await client.get(process.env.REDIS_USER);
      const userRedis = JSON.parse(userRedisStr)
      const post = await Post.findById(data.idPost)

      if (!userRedis.likes.includes(data.idPost) && data.like == true) {
        userRedis.likes.push(data.idPost)
        post.likers.push(userRedis._id)
      } else if (userRedis.likes.includes(data.idPost) && data.like == false) {
        userRedis.likes.splice(userRedis.likes.indexOf(data.idPost), 1)
        post.likers.splice(post.likers.indexOf(userRedis._id), 1)
      }
      await client.set(process.env.REDIS_USER, JSON.stringify(userRedis));
      await post.save()
      await User.findByIdAndUpdate(userRedis._id, { likes: userRedis.likes })
      res.status(200).json({
        EC: 0,
        msg: 'Success'
      })
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Server error ! ',
      });
    }

  },
  putUpdateUserAvatar: async (req, res) => {
    try {
      const avatar = req.body.avatar;
      const id = req.params.id;
      const user = await User.findById(id);
      const userRedisStr = await client.get(process.env.REDIS_USER);
      const userRedis = JSON.parse(userRedisStr)
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
        msg: 'Server error ! ',
      });
    }
  },
  deleteAvatar: async (req, res) => {
    try {
      let msgError = '';
      const { id, avatar } = req.params;
      const user = await User.findById(id);
      const userRedisStr = await client.get(process.env.REDIS_USER);
      const userRedis = JSON.parse(userRedisStr)
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
        msg: 'Server error ! ',
      });
    }
  },
  postUpdateUserBg: async (req, res) => {
    try {
      const bgAvatar = req.body.bgAvatar;
      const id = req.params.id;
      const userRedisStr = await client.get(process.env.REDIS_USER);
      const userRedis = JSON.parse(userRedisStr)
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
        msg: 'Server error ! ',
      });
    }
  },
  deleteBgAvatars: async (req, res) => {
    try {
      let msgError = '';
      const { id, bgAvatar } = req.params;
      const user = await User.findById(id);
      const userRedisStr = await client.get(process.env.REDIS_USER);
      const userRedis = JSON.parse(userRedisStr)
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
        msg: 'Server error ! ',
      });
    }
  },
};
