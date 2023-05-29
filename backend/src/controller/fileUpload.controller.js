const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');
const isImage = require('is-image');
const Post = require("../models/post");
const { getUserRedis, setUserRedis } = require("../services/user.redis");

module.exports = {
  postUploadAvatar: async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: 'No files were uploaded !' });
      }
      let { avatars } = req.files;
      // kiem tra item có phải là file ảnh ko
      if (Array.isArray(avatars)) {
        avatars.map((avatar) => {
          if (!isImage(avatar.name)) {
            return res.status(400).json({ msg: 'The file must be an image !' });
          }
        });
      } else {
        if (!isImage(avatars.name)) {
          return res.status(400).json({ msg: 'The file must be an image !' });
        }
      }

      const token = req.headers.token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findById(decoded.id);
      let totalUploadFileSize = user.totalUploadFileSize;
      if (Array.isArray(avatars)) {
        avatars.map((avatar) => {
          totalUploadFileSize += avatar.size;
        });
      } else {
        totalUploadFileSize += avatars.size;
      }

      if (!user.admin && totalUploadFileSize >= 100000000) {
        return res.status(413).json({
          msg: 'You have run out of space to upload !',
        });
      } else {
        const userRedis = await getUserRedis()
        userRedis.totalUploadFileSize = totalUploadFileSize
        await User.findByIdAndUpdate(decoded.id, { totalUploadFileSize });
        if (Array.isArray(avatars)) {
          let listAvatars = [];
          await Promise.all(
            avatars.map(async (avatar, index) => {
              const avatarName = `${decoded.id}-${new Date().getTime() + index
                }${path.extname(avatar.name)}`;
              const uploadPath = './src/public/images/avatars/' + avatarName;
              await avatar.mv(uploadPath);
              listAvatars.push(avatarName);
            })
          );
          const oldListAvatars = user.listAvatars;
          const newListAvatars = [...oldListAvatars, ...listAvatars];
          userRedis.listAvatars = newListAvatars
          await setUserRedis(userRedis)
          await User.findByIdAndUpdate(decoded.id, {
            listAvatars: newListAvatars,
          });
        } else {
          const avatarName = `${decoded.id
            }-${new Date().getTime()}${path.extname(avatars.name)}`;
          const uploadPath = './src/public/images/avatars/' + avatarName;
          await avatars.mv(uploadPath);
          const oldListAvatars = user.listAvatars;
          const newListAvatars = [...oldListAvatars, avatarName];
          const userRedis = await getUserRedis()
          userRedis.listAvatars = newListAvatars
          await setUserRedis(userRedis)
          await User.findByIdAndUpdate(decoded.id, {
            listAvatars: newListAvatars,
          });
        }

        return res.status(200).json({
          msg: 'Upload avatar successfully !',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Sever error !',
        data: null,
      });
    }
  },
  postUploadBg: async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: 'No files were uploaded !' });
      }
      let { bgs } = req.files;
      if (Array.isArray(bgs)) {
        bgs.map((bg) => {
          if (!isImage(bg.name)) {
            return res.status(400).json({ msg: 'The file must be an image !' });
          }
        });
      } else {
        if (!isImage(bgs.name)) {
          return res.status(400).json({ msg: 'The file must be an image !' });
        }
      }

      const token = req.headers.token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findById(decoded.id);
      let totalUploadFileSize = user.totalUploadFileSize;
      if (Array.isArray(bgs)) {
        bgs.map((bg) => {
          totalUploadFileSize += bg.size;
        });
      } else {
        totalUploadFileSize += bgs.size;
      }

      if (!user.admin && totalUploadFileSize >= 100000000) {
        return res.status(413).json({
          msg: 'You have run out of space to upload !',
        });
      } else {
        const userRedis = await getUserRedis()
        userRedis.totalUploadFileSize = totalUploadFileSize
        await User.findByIdAndUpdate(decoded.id, { totalUploadFileSize });
        if (Array.isArray(bgs)) {
          let listBgAvatars = [];
          await Promise.all(
            bgs.map(async (bg, index) => {
              const bgName = `${decoded.id}-${new Date().getTime() + index
                }${path.extname(bg.name)}`;
              const uploadPath = './src/public/images/bg-avatars/' + bgName;
              await bg.mv(uploadPath);
              listBgAvatars.push(bgName);
            })
          );
          const oldListAvatars = user.listBgAvatars;
          const newListAvatars = [...oldListAvatars, ...listBgAvatars];
          userRedis.listBgAvatars = newListAvatars
          await setUserRedis(userRedis)
          console.log("👉👉👉 ~ userRedis.listBgAvatars:", userRedis.listBgAvatars)
          await User.findByIdAndUpdate(decoded.id, {
            listBgAvatars: newListAvatars,
          });
        } else {
          const bgName = `${decoded.id}-${new Date().getTime()}${path.extname(
            bgs.name
          )}`;
          const uploadPath = './src/public/images/bg-avatars/' + bgName;
          await bgs.mv(uploadPath);
          const oldListAvatars = user.listBgAvatars;
          const newListAvatars = [...oldListAvatars, bgName];
          userRedis.listBgAvatars = newListAvatars
          await setUserRedis(userRedis)
          await User.findByIdAndUpdate(decoded.id, {
            listBgAvatars: newListAvatars,
          });
        }

        return res.status(200).json({
          msg: 'Upload avatar successfully !',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Sever error !',
        data: null,
      });
    }
  },
};
