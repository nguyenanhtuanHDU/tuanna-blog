const Notice = require("../models/notice");

module.exports = {
    createNotice: async (userSend, userGet, type, postID) => {
        try {
            const data = { userSend, userGet, type, postID }
            const noticeOld = await Notice.findOne({ 'userSend.id': userSend.id, postID })
            console.log(`🚀 ~ userGet:`, userGet)
            console.log(`🚀 ~ userSend:`, userSend)
            if (userGet.id.toString() !== userSend) { // chi thuc hien khi user like bai ng khac
                if (type === 'like') { // action like
                    if (noticeOld) { // case user like 2 lần
                        noticeOld.type = type
                        await noticeOld.save()
                    } else { // user chưa like lần nào
                        data.content = 'like your post'
                        const notice = await Notice.create(data)
                        return notice
                    }
                }
                else if (type === 'comment') { // action comment
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