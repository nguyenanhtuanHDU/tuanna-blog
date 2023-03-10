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
    },
    getUserByID: async (req, res) => {
        try {
            const user = await User.findOne({ id: req.params })
            const { username, email } = user
            console.log('>>> username: ', username);
            console.log('>>> email: ', email);
            res.status(200).json({
                EC: 0,
                data: {
                    username,
                    email
                },
                msg: "success"
            })
        } catch (error) {
            console.log(error);
            res.status(404).json({
                EC: -1,
                msg: 'Server error !'
            })
        }
    },
    postCreateAUser: async (req, res) => {
        try {
            const data = req.body
            const user = await User.create(data)
        } catch (error) {
            console.log(error);
        }

    }
}