const { signInController, signUpController } = require("../controller/authcontroller");
const express = require("express");

const router = express.Router()

module.exports = router

router.post('/signup', signUpController)
router.post('/login', signInController)