const client = require("../config/redis");
const User = require("../models/user");

module.exports = {
    getUserRedis: async () => {
        const userRedisStr = await client.get(process.env.REDIS_USER);
        const userRedis = JSON.parse(userRedisStr)
        return userRedis
    },
    setUserRedis: async (data) => {
        await client.set(process.env.REDIS_USER, JSON.stringify(data))
    },
    getListUser: async (admin) => {
        const users = await User.find({ admin }).select('avatar username createdAt birthday gender posts views').sort({ createdAt: 1 });
        return users
    }
}