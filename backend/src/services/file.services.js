const fs = require('fs');

module.exports = {
    deleteFiles: async (files) => {
        if (Array.isArray(files)) {
            files.map(file => {
                fs.unlinkSync('./src/public/images/posts/' + file);
            })
        } else {
            fs.unlinkSync('./src/public/images/posts/' + files);
        }
    }
}