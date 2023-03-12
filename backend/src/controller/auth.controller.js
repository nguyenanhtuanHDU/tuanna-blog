const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
  signUpController: async (req, res) => {
    try {
      const data = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(data.password, salt);
      data.password = hashPassword;
      const userEmailFind = await User.findOne({ email: data.email });
      const userUsernameFind = await User.findOne({ email: data.email });
      if (userEmailFind || userUsernameFind) {
        res.status(409).json({
          EC: 0,
          data: null,
          msg: 'Email or username already exists !',
        });
      }
      const user = await User.create(data);
      res.status(200).json({
        EC: 0,
        data: user,
        msg: 'Create accout success !',
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        EC: -1,
        data: null,
        msg: 'Server error !',
      });
    }
  },
  signInController: async (req, res) => {
    try {
      const data = req.body;
      const emailFind = await User.findOne({ email: data.email });
      const usernameFind = await User.findOne({ username: data.email });
      const emailOrUsername = emailFind || usernameFind;
      const passwordCheck = await bcrypt.compareSync(data.password, emailOrUsername.password);

      // console.log('>>> emailFind', emailFind);
      // console.log('>>> usernameFind', usernameFind);

      if (!emailFind && !usernameFind) {
        console.log('>>> ko co email username');
        res.status(401).json({
          EC: -1,
          msg: 'Email or username does not exist !',
        });
      }

      if (!passwordCheck) {
        res.status(401).json({
          EC: -1,
          msg: 'Wrong password !',
        });
      }

      if (emailOrUsername && passwordCheck) {
        const accessToken = jwt.sign(
          { id: emailOrUsername._id, admin: emailOrUsername.admin },
          process.env.TOKEN_KEY,
          { expiresIn: '30d' }
        );
        res.status(200).json({
          EC: 0,
          msg: 'Login success',
          token: accessToken,
        });
      }

      console.log('TRY', res.statusCode);
    } catch (error) {
      
      res.status(404).json({
        EC: -1,
        msg: 'Wrong email or username !',
      });
      console.log('CATCH', res.statusCode);
    }
  },
};
