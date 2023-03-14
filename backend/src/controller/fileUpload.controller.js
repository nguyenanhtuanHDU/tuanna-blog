const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');
const isImage = require('is-image');

module.exports = {
  postUploadAvatar: async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: 'No files were uploaded.' });
      }
      let avatar = req.files.avatar;
      const checkPathAvatar = isImage(avatar.name);
      if (!checkPathAvatar) {
        return res.status(400).json({ msg: 'The file must be an image' });
      }

      const token = req.body.token;
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const avatarName = `${decoded.id}-${new Date().getTime()}${path.extname(
        avatar.name
      )}`;
      const uploadPath = './src/public/images/avatars/' + avatarName;
      console.log('>>> avatarName: ', avatarName);
      await User.updateOne({ _id: decoded.id }, { avatar: avatarName });

      await avatar.mv(uploadPath);
      return res.status(200).json({
        msg: 'Upload avatar successfully',
        data: avatar,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'Sever error',
        data: null,
      });
    }
  },
};
