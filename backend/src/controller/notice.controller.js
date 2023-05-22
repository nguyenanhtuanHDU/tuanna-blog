const Notice = require("../models/notice");


module.exports = {
    getNotices: async (req, res) => {
        try {
            const data = await Notice.find({ 'userGet.id': req.params.id }).sort({ updateAt: -1 })
            res.status(200).json({
                data
            })
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                data: null,
                msg: 'Server error !',
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
                msg: 'Server error !',
            });
        }
    },
    postResetNotice: async (req, res) => {
        try {
            const { type, userID, postID } = req.body
            if (type === 'isRead') {
                await Notice.updateMany({ 'userGet.id': req.params.id }, { isRead: true })
            } else if (type === 'isClick') {
                const notice = await Notice.findOneAndUpdate({ postID, 'userGet.id': userID }, { isClick: true })
                console.log(`🚀 ~ notice:`, notice)
            }
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                data: null,
                msg: 'Server error !',
            });
        }
    }
}