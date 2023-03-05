const User = require("../models/user");
const { getAllUsersService } = require("../services/user.services")

module.exports = {
    getUsers: async (req, res) => {
        try {
            const users = await getAllUsersService()
            res.status(200).json({
                EC: 0,
                data: users
            })
        } catch (error) {
            console.log(error);
            res.status(404).json({
                EC: -1,
                data: null
            })
        }
    }
    ,
    postCreateAUser: async (req, res) => {
        try {
            const data = req.body
            const user = await User.create(data)
        } catch (error) {
            console.log(error);
        }

    }
}