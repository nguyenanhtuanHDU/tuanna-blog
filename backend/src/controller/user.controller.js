const { getAllUsersService } = require("../services/user.services")

module.exports = {
    getUsers:async(req, res) => {
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
}