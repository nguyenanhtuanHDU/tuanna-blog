

module.exports = {
    postCreateNotice: async() => {
        try {
            
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