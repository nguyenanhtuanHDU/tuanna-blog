const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        content: { type: String, required: true },
        postID: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
