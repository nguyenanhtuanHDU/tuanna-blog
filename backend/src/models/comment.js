const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        author: {
            id: { type: String, required: true },
            avatar: { type: String, required: true },
            username: { type: String, required: true },
        },
        content: { type: String, required: true },
        postID: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
