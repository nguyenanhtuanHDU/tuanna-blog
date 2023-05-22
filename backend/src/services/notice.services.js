const Notice = require("../models/notice");

module.exports = {
    createNotice: async (userSend, userGet, type, postID) => {
        try {
            const data = { userSend, userGet, type, postID }
            const noticeOld = await Notice.findOne({ 'userSend.id': userSend.id, postID })
            if (userGet.id !== userSend.id) { // chi thuc hien khi user like bai ng khac
                if (type === 'like') {
                    if (noticeOld) {
                        noticeOld.type = type
                    } else {
                        data.content = 'like your post'
                        const notice = await Notice.create(data)
                        return notice
                    }
                }

                else if (type === 'comment') {
                    data.content = 'comment in your post'
                    const notice = await Notice.create(data)
                    console.log(`🚀 ~ notice:`, notice)
                    return notice
                }
            }
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
        }
    }
}