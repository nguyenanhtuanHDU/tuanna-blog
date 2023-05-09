const { logInController, signUpController } = require("../controller/auth.controller");
const express = require("express");

const router = express.Router()

module.exports = router

router.post('/signup', signUpController)
router.post('/login', logInController)