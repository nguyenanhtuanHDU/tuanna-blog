const bcrypt = require('bcrypt');
const { login } = require("../middleware/auth.middleware");
const User = require("../models/user");
const { createAUserService } = require("../services/user.services");

module.exports = {
    signUpController: async (req, res) => {
        try {
            const data = req.body
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(data.password, salt);
            data.password = hashPassword

            const user = await createAUserService(data);
            res.status(200).json({
                EC: 0,
                data: user
            })
        } catch (error) {
            console.log(error);
            res.status(404).json({
                EC: -1,
                data: null
            })
        }
    },
    signInController: async (req, res) => {
        try {
            const data = req.body
            const loginVerify = await login(data)
            if (loginVerify.checked) {
                res.status(200).json({
                    EC: 0,
                    msg: loginVerify
                })
            } else {
                res.status(401).json({
                    EC: -1,
                    msg: loginVerify
                })
            }

        } catch (error) {
            console.log(error);
            res.status(404).json({
                EC: -1,
                data: null
            })
        }
    }
}