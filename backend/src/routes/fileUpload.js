const express = require('express');
const router = express.Router();

const upload = require('../services/upload');
module.exports = router;

router.post('/avatar', upload.single('avatar'), (req, res) => {
  return res.status(200).json({
    msg: 'success',
    data: req.file,
  });
});
