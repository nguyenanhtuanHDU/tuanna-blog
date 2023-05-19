const express = require('express');
const {
  getAllUsers,
  getUserInfo,
  putUpdateUserInfo,
  getListAvatars,
  putUpdateUserAvatar,
  deleteAvatar,
  postUpdateUserBg,
  deleteBgAvatars,
  clearRedis,
  getRedis,
  putUpdateUserLikes,
} = require('../controller/user.controller');
const middleware = require('../middleware/middleware.controller');
const { postCreatePost, getAllPosts, deletePost, getPostByID, getTopPostViewers, putUpdatePostViews, getTopPostLikes, putUpdatePost, getTopPostComments } = require("../controller/post.controller");
const { postCreateComment, putUpdateComment, deleteComment } = require("../controller/comment.controller");
const router = express.Router();

// USER
// router.get('/user', getAllUsers);
router.get('/user/clear-redis', clearRedis);
router.get('/user/redis', getRedis);
router.put('/user', middleware.verifyUpdateUser, putUpdateUserInfo);
router.put('/user/likes', middleware.verifyUpdateUser, putUpdateUserLikes);
router.put('/user/:id/avatar', middleware.verifyToken, putUpdateUserAvatar);
router.put('/user/:id/bgAvatar', middleware.verifyToken, postUpdateUserBg);
router.get('/user-info', middleware.verifyToken, getUserInfo);
router.get('/user/:id/listAvatars', middleware.verifyToken, getListAvatars);
router.delete(
  '/user/:id/listAvatars/:avatar',
  middleware.verifyToken,
  deleteAvatar
);
router.delete(
  '/user/:id/listBgAvatars/:bgAvatar',
  middleware.verifyToken,
  deleteBgAvatars
);

//POST
router.get('/post', middleware.verifyToken, getAllPosts)
router.get('/post/:id', middleware.verifyToken, getPostByID)
router.get('/post/top-viewer/:count', middleware.verifyToken, getTopPostViewers)
router.get('/post/top-likes/:count', middleware.verifyToken, getTopPostLikes)
router.get('/post/top-comments/:count', middleware.verifyToken, getTopPostComments)
router.post('/post', middleware.verifyToken, postCreatePost)
router.put('/post/:id/viewer', middleware.verifyToken, putUpdatePostViews)
router.put('/post/:id', middleware.verifyToken, putUpdatePost)
router.delete('/post/:id', middleware.verifyToken, deletePost)

// COMMENT
router.post('/comment', middleware.verifyToken, postCreateComment)
router.put('/comment/:id', middleware.verifyToken, putUpdateComment)
router.delete('/comment/:id', middleware.verifyToken, deleteComment)

module.exports = router;
