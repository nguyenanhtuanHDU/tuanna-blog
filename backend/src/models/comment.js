const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        author: { type: String, required: true },
        content: { type: String, required: true },
        post: [{ type: mongoose.Schema.Post.ObjectId, ref: 'post' }],
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('user', commentSchema);

module.exports = Comment;
