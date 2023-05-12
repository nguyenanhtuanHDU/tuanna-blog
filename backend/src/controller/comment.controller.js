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
    }
}