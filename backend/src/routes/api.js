const express = require('express')
const { getUsers, getUserByToken } = require("../controller/user.controller")
const router = express.Router()

router.get('/user', getUsers)
router.post('/user-info', getUserByToken)

module.exports = router