const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require('../models/user');
const { setUserRedis } = require("../services/user.redis");

module.exports = {
  signUpController: async (req, res) => {
    try {
      const data = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(data.password, salt);
      data.password = hashPassword;
      const userEmailFind = await User.findOne({ email: data.email });
      const userUsernameFind = await User.findOne({ username: data.username });
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
        msg: 'Server error',
      });
    }
  },
  logInController: async (req, res) => {
    try {
      const data = req.body;
      const emailFind = await User.findOne({ email: data.email })?.populate('notices');
      const usernameFind = await User.findOne({ username: data.email })?.populate('notices');

      if (!emailFind && !usernameFind) {
        res.status(401).json({
          EC: -1,
          msg: 'Email or username is not valid !',
        });
      }

      const userInfoLogin = emailFind || usernameFind;
      await setUserRedis(userInfoLogin)
      const passwordCheck = await bcrypt.compareSync(
        data.password,
        userInfoLogin.password
      );

      if (!passwordCheck) {
        res.status(401).json({
          EC: -1,
          msg: 'Wrong password !',
        });
      }

      if (userInfoLogin && passwordCheck) {
        const accessToken = jwt.sign(
          { id: userInfoLogin._id, admin: userInfoLogin.admin },
          process.env.TOKEN_KEY,
          { expiresIn: '1d' }
        );
        res.status(200).json({
          EC: 0,
          msg: 'Login success',
          token: accessToken,
        });
      }

    } catch (error) {
      console.log(error);
      res.status(404).json({
        EC: -1,
        msg: 'Server error',
      });
    }
  },
};
