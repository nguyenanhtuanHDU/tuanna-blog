const express = require('express')
const { getUsers } = require("../controller/user.controller")
const router = express.Router()

router.get('/user', getUsers)

module.exports = router