const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
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
            const userEmailFind = await User.findOne({ email: data.email })
            const userUsernameFind = await User.findOne({ email: data.email })
            if (userEmailFind || userUsernameFind) {
                res.status(409).json({
                    EC: 0,
                    data: null,
                    msg: 'Email or username already exists !'
                })
            }
            const user = await createAUserService(data);
            res.status(200).json({
                EC: 0,
                data: user,
                msg: 'Create accout success !'
            })
        } catch (error) {
            console.log(error);
            res.status(404).json({
                EC: -1,
                data: null,
                msg: "Server error !"
            })
        }
    },
    signInController: async (req, res) => {
        try {
            const data = req.body
            const emailFind = await User.findOne({ email: data.email })
            console.log('>>> emailFind: ', emailFind);

            if (!emailFind) {
                res.status(401).json({
                    EC: -1,
                    msg: 'Email does not exist !'
                })
            }
            if (emailFind) {
                const { username, email, password, ...others } = emailFind
                const accessToken = jwt.sign({ id: emailFind._id, admin: emailFind.admin }, process.env.TOKEN_KEY, { expiresIn: '30d' });
                console.log('>>> accessToken: ', accessToken);
                res.status(200).json({
                    EC: 0,
                    msg: "Login success",
                    token: accessToken
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
                msg: "Server error !"
            })
        }
    }
}