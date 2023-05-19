const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userID: { type: String },
        userAvatar: { type: String },
        userUsername: { type: String },
        title: { type: String },
        content: { type: String },
        views: { type: Number, default: 0 },
        // likers: { type: [String], default: [] },
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
