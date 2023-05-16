const client = require('../config/redis');
const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports = {
    postCreateComment: async (req, res) => {
        try {
            if (req.body.type === 'CREATE_COMMENT') {
                const userRedisStr = await client.get(process.env.REDIS_USER);
                const userRedis = JSON.parse(userRedisStr)
                const data = {
                    author: {
                        id: userRedis._id,
                        avatar: userRedis.avatar,
                        username: userRedis.username
                    },
                    content: req.body.content,
                    postID: req.body.postID
                }
                const comment = await Comment.create(data)
                const post = await Post.findById(data.postID)
                post.comments = [...post.comments, comment._id]
                await post.save()
                res.status(200).json({
                    msg: 'Success',
                })
            }
        } catch (error) {
            console.log("🚀 ~ error:", error)
            res.status(404).json({
                msg: 'Server error ! ',
            });
        }
    },
    putUpdateComment: async (req, res) => {
        try {
            console.log(req.params);
            console.log(req.body);
            await Comment.findByIdAndUpdate(req.params.id, req.body)
            res.status(200).json({
                msg: 'Update comment successfully'
            })
        } catch (error) {
            console.log("🚀 ~ error:", error)
            res.status(404).json({
                msg: 'Server error ! ',
            });
        }
    },
    deleteComment :async(req, res) => {
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
                msg: 'Server error ! ',
            });
        }
    }

}