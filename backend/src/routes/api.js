const express = require('express');
const {
  getAllUsers,
  getUserInfo,
  putUpdateUserInfo,
  putUpdateUserAvatar,
  deleteAvatar,
  postUpdateUserBg,
  deleteBgAvatars,
  clearRedis,
  getRedis,
  putUpdateUserLikes,
  getUserByID,
  getListAdmins,
  getNonAdminUsers,
  deleteUserByID,
  putUpdateUserPassword,
  putUpdateUserInfoByAdmin,
} = require('../controller/user.controller');
const middleware = require('../middleware/middleware.controller');
const { postCreatePost, getAllPosts, getPostByID, getTopPostViewers, putUpdatePostViews, getTopPostLikes, putUpdatePost, getTopPostComments, getPostsByInfo, getAllPostsNonPaging, deletePostByID } = require("../controller/post.controller");
const { postCreateComment, putUpdateComment, deleteComment } = require("../controller/comment.controller");
const { getNotices, postResetNotice } = require("../controller/notice.controller");
const router = express.Router();

// USER
// router.get('/user', getAllUsers);
router.get('/user/clear-redis', clearRedis);
router.get('/user/list-admins', middleware.verifyAdmin, getListAdmins);
router.get('/user/list-users', middleware.verifyAdmin, getNonAdminUsers);
router.get('/user/:id', getUserByID);
router.get('/user/redis', getRedis);
router.get('/user-info', middleware.verifyToken, getUserInfo);
router.put('/user', middleware.verifyUpdateUser, putUpdateUserInfo);
router.put('/user/:id', middleware.verifyAdmin, putUpdateUserInfoByAdmin);
router.put('/user/:id/password', middleware.verifyUpdateUser, putUpdateUserPassword);
router.put('/user/:id/likes', middleware.verifyToken, putUpdateUserLikes);
router.put('/user/:id/avatar', middleware.verifyToken, putUpdateUserAvatar);
router.put('/user/:id/bgAvatar', middleware.verifyToken, postUpdateUserBg);
router.delete('/user/:id/', middleware.verifyAdmin, deleteUserByID);
router.delete('/user/:id/listAvatars/:avatar', middleware.verifyToken, deleteAvatar);
router.delete('/user/:id/listBgAvatars/:bgAvatar', middleware.verifyToken, deleteBgAvatars);

// POST
router.get('/post', middleware.verifyToken, getAllPosts)
router.get('/posts', middleware.verifyToken, getAllPostsNonPaging)
router.get('/post/:id', middleware.verifyToken, getPostByID)
router.get('/posts/filter', middleware.verifyToken, getPostsByInfo)
router.get('/post/top-viewer/:count', middleware.verifyToken, getTopPostViewers)
router.get('/post/top-likes/:count', middleware.verifyToken, getTopPostLikes)
router.get('/post/top-comments/:count', middleware.verifyToken, getTopPostComments)
router.post('/post', middleware.verifyToken, postCreatePost)
router.put('/post/:id/viewer', middleware.verifyToken, putUpdatePostViews)
router.put('/post/:id', middleware.verifyToken, putUpdatePost)
router.delete('/post/:id', middleware.verifyToken, deletePostByID)

// COMMENT
router.post('/comment', middleware.verifyToken, postCreateComment)
router.put('/comment/:id', middleware.verifyToken, putUpdateComment)
router.delete('/comment/:id', middleware.verifyToken, deleteComment)

// NOTICE
router.get('/notice/:id', middleware.verifyToken, getNotices)
router.post('/notice/:id', middleware.verifyToken, postResetNotice)

module.exports = router;
