const express = require('express');
const { postUploadAvatar } = require('../controller/fileUpload.controller');
const router = express.Router();

module.exports = router;

router.post('/avatar', postUploadAvatar);
