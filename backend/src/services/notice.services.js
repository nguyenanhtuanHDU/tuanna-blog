const Notice = require("../models/notice");

module.exports = {
    createNotice: async (userSend, userGet, type, postID) => {
        try {
            const data = { userSend, userGet, type, postID }
            const noticeOld = await Notice.findOne({ 'userSend.id': userSend.id, postID })
            if (userGet.id !== userSend.id) {
                if (noticeOld) {
                    noticeOld.type = type
                } else if (type === 'like') {
                    data.content = 'like your post'
                    const notice = await Notice.create(data)
                    return notice
                }
            }
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
        }
    }
}