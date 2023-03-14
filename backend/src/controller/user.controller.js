const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { getAllUsersService } = require('../services/user.services');

module.exports = {
  getUsers: async (req, res) => {
    try {
      const users = await getAllUsersService();
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
  getUserByToken: async (req, res) => {
    try {
      const token = req.body.token;
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const user = await User.findOne({ _id: decoded.id });
      const { username, email, address, avatar } = user;

      res.status(200).send({
        username,
        email,
        address,
        avatar,
        id: decoded.id,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        EC: -1,
        msg: 'User does not exist !',
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
};
