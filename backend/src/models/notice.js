const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
    {
        userSend: {
            id: { type: String, required: true },
            username: { type: String, required: true },
            avatar: { type: String, required: true }
        },
        userGet: {
            id: { type: String, required: true },
        },
        type: { type: String, required: true, enum: ['comment', 'like'] },
        content: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Notice = mongoose.model('notice', noticeSchema);

module.exports = Notice;
