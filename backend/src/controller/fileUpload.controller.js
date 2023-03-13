var jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');

module.exports = {
  postUploadAvatar: async (req, res) => {
    try {
      console.log('>>> req.body: ', req.body);
      const token = req.body.token;
      var decoded = jwt.verify(token, process.env.TOKEN_KEY);

      let avatar = req.files.avatar;
      let uploadPath;

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }

      const avatarName = `${decoded.id}-${new Date().getTime()}${path.extname(
        avatar.name
      )}`;
      uploadPath = './src/public/images/avatars/' + avatarName;

      const user = await User.updateOne({ avatar: avatarName });
      console.log('>>> user: ', user);

      await avatar.mv(uploadPath);
      return res.status(200).json({
        msg: 'success',
        data: avatar,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        msg: 'error',
        data: null,
      });
    }
  },
};
