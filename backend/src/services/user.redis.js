const client = require("../config/redis")

module.exports = {
    getUserRedis: async () => {
        const userRedisStr = await client.get(process.env.REDIS_USER);
        const userRedis = JSON.parse(userRedisStr)
        return userRedis
    },
    setUserRedis: async (data) => {
        await client.set(process.env.REDIS_USER, JSON.stringify(data))
    }
}