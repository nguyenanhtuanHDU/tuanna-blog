const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
    {
        userSend: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        userGet: {
            id: { type: String },
        },
        type: { type: String, required: true, enum: ['comment', 'like'] },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        isClick: { type: Boolean, default: false },
        postID: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Notice = mongoose.model('notice', noticeSchema);

module.exports = Notice;
