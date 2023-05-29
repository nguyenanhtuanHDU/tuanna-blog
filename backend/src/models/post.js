const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userID: { type: String, require: true },
        userAvatar: { type: String, require: true },
        userUsername: { type: String, require: true },
        title: { type: String, require: true },
        content: { type: String, require: true },
        views: { type: Number, default: 0 },
        likers: [{
            type: new mongoose.Schema({
                userLikeID: {
                    type: String
                },
                avatar: {
                    type: String
                },
                username: {
                    type: String
                }
            }, {
                timestamps: true,
            })
        }],
        tag: { type: String, require: true },
        images: { type: [String], default: [] },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
        // blockComment: { type: Boolean } -> phát triển sau, phân loại block
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model('post', postSchema);

module.exports = Post;
