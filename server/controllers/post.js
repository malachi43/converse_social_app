import Post from '../models/Post.js'
import User from '../models/User.js'

// CREATE
export const createPost = async (req, res) => {
    try {
        const { picturePath, userId, description } = req.body
        const user = await User.findById(userId)
        const newPost = await Post({
            userId,
            firstName: user.firstName,
            lastname: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save()

        const post = await Post.find()
        res.status(201).json(post)
    } catch (error) {
        res.status(409).json({ msg: error.message })
    }
}


//READ
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params
        const posts = await Post.find({ userId })
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }

}

// UPDATE
export const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body
        const post = await Post.findById(id)
        const isLiked = post.likes.get(userId)
        if (isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findById(id,
            { likes: post.likes },
            { new: true, runValidators: true }
        )

        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}