const Post = require("../models/post");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { getUserRedis } = require("../services/user.services");
const { deleteFiles } = require("../services/file.services");

module.exports = {
    getAllPosts: async (req, res) => {
        try {
            const { page, limit, userID, tag } = req.query
            if (userID) {
                console.log(`🚀 ~ userID:`, userID)
                let Asia = Europe = Africa = America = Oceania = Antarctica = 0;
                const posts = await Post.find({ author: userID })
                posts.map((post) => {
                    if (post.tag === "Asia") {
                        Asia += 1;
                    }
                    if (post.tag === "Europe") {
                        Europe += 1;
                    }
                    if (post.tag === "Africa") {
                        Africa += 1;
                    }
                    if (post.tag === "America") {
                        America += 1;
                    }
                    if (post.tag === "Oceania") {
                        Oceania += 1;
                    }
                    if (post.tag === "Antarctica") {
                        Antarctica += 1;
                    }
                })
                res.status(200).json({
                    Asia,
                    Europe,
                    Africa,
                    America,
                    Oceania,
                    Antarctica
                })
            } else {
                const skip = (page - 1) * limit
                const postsCount = await Post.count({}).exec()
                const posts = await Post.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate(
                    {
                        path: 'comments',
                        populate: {
                            path: 'author',
                            model: 'user',
                            select: '_id username avatar '
                        }
                    }).populate({
                        path: 'author',
                        select: '_id username avatar'
                    }).populate({
                        path: 'likers',
                        model: 'user',
                        select: '_id username avatar'
                    }).exec()
                res.status(200).json({
                    EC: 0,
                    data: posts,
                    postsCount
                })
            }
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    getAllPostsNonPaging: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: -1 }).populate({
                path: 'author',
                select: '_id username avatar admin'
            }).exec()
            res.status(200).json({
                EC: 0,
                data: posts,
            })
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    getPostByID: async (req, res) => {
        try {
            const data = await Post.findById(req.params.id).populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    model: 'user',
                    select: 'avatar username _id'
                }
            }).populate({
                path: 'author',
                select: '_id username avatar'
            }).populate({
                path: 'likers',
                model: 'user',
                select: '_id username avatar'
            }).exec()
            if (!data) {
                return res.status(404).json({
                    msg: "Post not found"
                })
            }
            res.status(200).json({
                EC: 0,
                data
            })
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    },
    getPostsByInfo: async (req, res) => {
        try {
            const { page, limit, title, tag } = req.query
            //  PHÂN TRANG
            if (page && limit) {
                const skip = (page - 1) * limit
                const postsCount = await Post.find({ tag })
                const posts = await Post.find({ tag }).populate({
                    path: 'comments',
                    populate: {
                        path: 'author',
                        model: 'user',
                        select: 'avatar username _id'
                    }
                }).populate({
                    path: 'author',
                    select: '_id username avatar'
                }).populate({
                    path: 'likers',
                    model: 'user',
                    select: '_id username avatar'
                }).skip(skip).limit(limit).sort({ createdAt: -1 })
                console.log(`🚀 ~ posts:`, posts)
                res.status(200).json({
                    data: posts,
                    postsCount: postsCount.length
                })
            }
            // TÌM KIẾM THEO TITLE POST
            else if (title) {
                // const posts = await Post.find({ title: { $regex: title, $options: 'i' } }).select(['title', 'userAvatar', 'userUsername', 'updatedAt']).sort({ updatedAt: -1 })
                const posts = await Post.find({ title: { $regex: title, $options: 'i' } }).populate({
                    path: 'comments',
                    populate: {
                        path: 'author',
                        model: 'user',
                        select: 'avatar username _id'
                    }
                }).populate({
                    path: 'author',
                    select: '_id username avatar'
                }).select(['title', 'updatedAt']).sort({ updatedAt: -1 })



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
    getTopPostViewers: async (req, res) => {
        try {
            const data = await Post.find().sort({ views: -1, title: -1 }).limit(req.params.count).populate({
                path: 'author',
                select: '_id username avatar'
            })
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
            const posts = await Post.find().populate({
                path: 'author',
                select: '_id username avatar'
            }).populate({
                path: 'likers',
                model: 'user',
                select: '_id username avatar'
            })
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
            console.log(`🚀 ~ data:`, data)
            const userDecoded = await getUserRedis()
            const images = []
            if (!postImages || Object.keys(postImages).length === 0) {
                return res.status(400).send('No files were uploaded.');
            } else {
                postImages.map(async (img, index) => {
                    const postImageName = `${userDecoded._id}-${new Date().getTime() + index
                        }${path.extname(img.name)}`;
                    const uploadPath = './src/public/images/posts/' + postImageName;
                    images.push(postImageName)
                    await img.mv(uploadPath);
                })
            }
            const user = await User.findById(userDecoded._id)
            data.images = images
            data.author = userDecoded._id
            const post = await Post.create(data)
            user.posts.push(post.id)
            await user.save()
            res.status(200).json({
                EC: 0,
                msg: 'Create post successfully'
            })
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                msg: 'Server error 2'
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
                    await deleteFiles(img)
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
    deletePostByID: async (req, res) => {
        try {
            const postID = req.params.id
            const post = await Post.findByIdAndDelete(postID)

            const userPost = await User.findOne({ posts: { $in: [postID] } })
            userPost.posts.splice(userPost.posts.indexOf(postID), 1)
            await userPost.save()

            const userLikes = await User.find({ likes: { $in: [postID] } })
            userLikes.map(async (user) => {
                user.likes.splice(user.likes.indexOf(postID), 1)
                await user.save()
            })

            await deleteFiles(post.images)
            res.status(200).json({
                EC: 0,
                msg: "Delete post successfully"
            })
        } catch (error) {
            console.log(`🚀 ~ error:`, error)
            res.status(404).json({
                EC: -1,
                msg: 'Server error'
            })
        }
    }
}