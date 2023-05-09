const Post = require("../models/post");
const User = require("../models/user");
var jwt = require('jsonwebtoken');
const path = require('path');

module.exports = {
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find()
            res.status(200).json({
                EC: 0,
                data: posts
            })
        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    postCreatePost: async (req, res) => {
        try {
            let { postImages } = req.files
            if (!Array.isArray(postImages)) {
                postImages = [postImages]
            }
            const data = JSON.parse(req.body.data)
            const token = req.headers.token;
            const accessToken = token.split(' ')[1];
            const userDecoded = jwt.verify(accessToken, process.env.TOKEN_KEY);
            const images = []
            if (!postImages || Object.keys(postImages).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }
            postImages.map(async (img, index) => {
                const postImageName = `${userDecoded.id}-${new Date().getTime() + index
                    }${path.extname(img.name)}`;
                const uploadPath = './src/public/images/posts/' + postImageName;
                images.push(postImageName)
                await img.mv(uploadPath);
            })
            const user = await User.findById(userDecoded.id)
            data.images = images
            data.userID = userDecoded.id
            data.userAvatar = user.avatar
            data.userUsername = user.username
            await Post.create(data)
            user.postsCount = user.postsCount + 1
            await user.save()
            res.status(200).json({
                EC: 0,
                msg: 'Create post successfully'
            })
        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    deletePost: async (req, res) => {
        try {
            await Post.findByIdAndDelete(req.params.id)
            res.status(200).json({
                EC: 0,
                msg: "Delete post successfully"
            })
        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    }
}