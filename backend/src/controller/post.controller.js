const Post = require("../models/post");
const User = require("../models/user");
var jwt = require('jsonwebtoken');
const path = require('path');
var fs = require('fs');

module.exports = {
    getAllPosts: async (req, res) => {
        try {
            const { page, limit } = req.query
            const skip = (page - 1) * limit
            const postsCount = await Post.count({}).exec()
            const posts = await Post.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate('comments').exec()
            res.status(200).json({
                EC: 0,
                data: posts,
                postsCount
            })
        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    getPostByID: async (req, res) => {
        try {
            const data = await Post.findById(req.params.id).populate('comments').exec()
            // data.views = data.views + 1
            // data.save()
            res.status(200).json({
                EC: 0,
                data
            })
        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    getPostsByInfo: async (req, res) => {
        try {
            const { page, limit, title } = req.query
            //  PHÂN TRANG
            if (page && limit) {
                const skip = (page - 1) * limit
                const postsCount = await Post.find({ tag: req.query.tag })
                const posts = await Post.find({ tag: req.query.tag }).populate('comments').skip(skip).limit(limit).sort({ createdAt: -1 })
                res.status(200).json({
                    data: posts,
                    postsCount: postsCount.length
                })
            }
            // TÌM KIẾM THEO TITLE POST
            else if (title) {
                const posts = await Post.find({ title: { $regex: title, $options: 'i' } }).select(['title', 'userAvatar', 'userUsername', 'updatedAt'])
                res.status(200).json({
                    data: posts,
                    postsCount: posts.length
                })
            }


        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    getPostsByTitle: async (req, res) => {
        try {
            console.log(req.body);
            // res.status(200).json({
            //     data: posts,
            //     postsCount: postsCount.length
            // })
        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    getTopPostViewers: async (req, res) => {
        try {
            const data = await Post.find().sort({ views: -1, title: -1 }).limit(req.params.count)
            res.status(200).json({
                data
            })
        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    getTopPostLikes: async (req, res) => {
        try {
            const posts = await Post.find()
            const data = posts.sort((a, b) => b.likers.length === a.likers.length ? a.title.localeCompare(b.title) : b.likers.length - a.likers.length).slice(0, Number(req.params.count))
            res.status(200).json({
                data
            })
        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    getTopPostComments: async (req, res) => {
        try {
            const posts = await Post.find()
            const data = posts.sort((a, b) => b.comments.length === a.comments.length ? a.title.localeCompare(b.title) : b.comments.length - a.comments.length).slice(0, Number(req.params.count))
            res.status(200).json({
                data
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
            } else {
                postImages.map(async (img, index) => {
                    const postImageName = `${userDecoded.id}-${new Date().getTime() + index
                        }${path.extname(img.name)}`;
                    const uploadPath = './src/public/images/posts/' + postImageName;
                    images.push(postImageName)
                    await img.mv(uploadPath);
                })
            }
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
    putUpdatePost: async (req, res) => {
        try {
            const token = req.headers.token;
            const accessToken = token.split(' ')[1];
            const userDecoded = jwt.verify(accessToken, process.env.TOKEN_KEY);
            const data = JSON.parse(req.body.data)
            const oldPost = await Post.findById(req.params.id)
            const images = []

            for (let img of oldPost.images) {
                if (!data.images.includes(img)) {
                    fs.unlinkSync('./src/public/images/posts/' + img);
                }
            }
            if (req.files && req.files.postImages) {
                let { postImages } = req.files
                if (!Array.isArray(postImages)) {
                    postImages = [postImages]
                }
                postImages.map(async (img, index) => {
                    const postImageName = `${userDecoded.id}-${new Date().getTime() + index
                        }${path.extname(img.name)}`;
                    const uploadPath = './src/public/images/posts/' + postImageName;
                    images.push(postImageName)
                    await img.mv(uploadPath);
                })
                data.images = [...data.images, ...images]
            }
            const post = await Post.findByIdAndUpdate(req.params.id, data)
            res.status(200).json({
                EC: 0,
                msg: "Update post success"
            })
        } catch (error) {
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    putUpdatePostViews: async (req, res) => {
        try {
            const data = await Post.findById(req.params.id)
            data.views = data.views + 1
            data.save()
            res.status(200).json({
                EC: 0,
                msg: "Success"
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