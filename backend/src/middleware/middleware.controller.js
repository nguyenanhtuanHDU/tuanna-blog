const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = require("../config/redis");
const User = require("../models/user");

const middleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    const accessToken = token.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({
        msg: 'You are not authenticated !',
      });
    }
    jwt.verify(accessToken, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          msg: 'Token is not valid !',
        });
      } else {
        next();
      }
    });
  },
  verifyUpdateUser: (req, res, next) => {
    middleware.verifyToken(req, res, async () => {
      const token = req.headers.token;
      const accessToken = token.split(' ')[1];
      const userDecoded = jwt.verify(accessToken, process.env.TOKEN_KEY);
      const userRedisStr = await client.get(process.env.REDIS_USER);
      const userRedis = JSON.parse(userRedisStr)

      if (!userDecoded.admin && userRedis.editCount >= 1) {
        return res.status(400).json({
          msg: 'You have run out of times to edit !',
        });
      } else {
        next();
      }
    });
  },
};

module.exports = middleware;
