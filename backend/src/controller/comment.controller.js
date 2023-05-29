const Comment = require("../models/comment");
const Post = require("../models/post");
const { createNotice } = require("../services/notice.services");
const { getUserRedis } = require("../services/user.redis");

module.exports = {
    postCreateComment: async (req, res) => {
        try {
            const userRedis = await getUserRedis()
            const data = {
                author: userRedis._id,
                content: req.body.content,
                postID: req.body.postID
            }
            const post = await Post.findById(data.postID)
            await createNotice(data.author, { id: post.userID }, 'comment', data.postID)
            const comment = await Comment.create(data)
            post.comments = [...post.comments, comment._id]
            await post.save()
            res.status(200).json({
                msg: 'Success',
            })
        } catch (error) {
            console.log("🚀 ~ error:", error)
            res.status(404).json({
                msg: 'Server error',
            });
        }
    },
    putUpdateComment: async (req, res) => {
        try {
            await Comment.findByIdAndUpdate(req.params.id, req.body)
            res.status(200).json({
                msg: 'Update comment successfully'
            })
        } catch (error) {
            console.log("🚀 ~ error:", error)
            res.status(404).json({
                msg: 'Server error',
            });
        }
    },
    deleteComment: async (req, res) => {
        try {
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json({
                EC: 0,
                msg: 'Delete comment success'
            })
        } catch (error) {
            console.log("🚀 ~ error:", error)
            res.status(404).json({
                EC: -1,
                msg: 'Server error',
            });
        }
    }

}