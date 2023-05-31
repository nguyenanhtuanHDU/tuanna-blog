const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        title: { type: String, require: true },
        content: { type: String, require: true },
        views: { type: Number, default: 0 },
        likers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
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
