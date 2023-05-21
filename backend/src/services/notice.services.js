const Notice = require("../models/notice");

module.exports = {
    createNotice: async (userSend, userGet, type) => {
        try {
            const data = { userSend, userGet, type }
            if (type === 'like') {
                data.content = userSend.username + ' like your post'
                const notice = await Notice.create(data)
                // io.on('connection', socket => {
                //     socket.emit('notice', notice)
                // });
                return notice
            }

        } catch (error) {
            console.log(`🚀 ~ error:`, error)
        }
    }
}