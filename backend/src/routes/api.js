const express = require('express')
const { getUsers, getUserByID } = require("../controller/user.controller")
const router = express.Router()

router.get('/user', getUsers)

router.get('/user/:id', getUserByID)

module.exports = router