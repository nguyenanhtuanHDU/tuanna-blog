const Notice = require("../models/notice");


module.exports = {
    getNotices: async (req, res) => {
        try {
            const data = await Notice.find({ 'userGet.id': req.params.id }).sort({ createdAt: -1 }).populate({
                path: 'userSend',
                select: '_id username avatar'
            })
            res.status(200).json({
                data
            })
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                data: null,
                msg: 'Server error',
            });
        }
    },
    postCreateNotice: async () => {
        try {

        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                data: null,
                msg: 'Server error',
            });
        }
    },
    postResetNotice: async (req, res) => {
        try {
            const { type, noticeID } = req.body
            if (type === 'isRead') {
                await Notice.updateMany({ 'userGet.id': req.params.id }, { isRead: true })
                // reset all notice read
            } else if (type === 'isClick') {
                const notice = await Notice.findByIdAndUpdate(noticeID, { isClick: true })
            }
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                data: null,
                msg: 'Server error',
            });
        }
    }
}