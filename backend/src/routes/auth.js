const bcrypt = require('bcrypt');
const User = require("../models/user");

const { createAUserService } = require("../services/user.services")

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
            const user = await User.findOne({ email: data.email })
            const passwordCheck = await bcrypt.compare(data.password, user.password);

            console.log('>>> passwordCheck: ', passwordCheck);

            if (!user) {
                res.status(401).json({
                    EC: -1,
                    msg: "Wrong email !"
                })
                return
            }
            if (!passwordCheck) {
                res.status(401).json({
                    EC: -1,
                    msg: "Wrong password !"
                })
                return
            }
            if (user && passwordCheck) {
                
                
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