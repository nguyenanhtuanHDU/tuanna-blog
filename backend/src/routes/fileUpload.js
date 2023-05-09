const express = require('express');
const { postUploadAvatar, postUploadBg } = require('../controller/fileUpload.controller');
const router = express.Router();

module.exports = router;

router.post('/avatar', postUploadAvatar);
router.post('/bg', postUploadBg);
