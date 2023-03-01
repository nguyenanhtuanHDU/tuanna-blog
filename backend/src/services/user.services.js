const User = require("../models/user")

module.exports = {
    createAUserService: async (data) => {
        const user = await User.create(data)
        return user
    },
    getAllUsersService: async () => {
        const users = await User.find({})
        return users
    }
}