import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    userId: {
        type:String,
        required: true
    },
    firstName: {
        type:String,
        required: true
    },
    lastName: {
        type:String,
        required: true
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    
    //When you like a post you add to the map and 
    //when you unlike you remove from the map. The value of the map is always true
    likes: {
        type: Map,
        of: Boolean
    },
    comments: {
        type: Array,
        default: []
    }
}, {timeseries: true})

const Post = mongoose.model('Post', PostSchema)

export default Post