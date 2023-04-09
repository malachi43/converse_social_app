import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        min: 2,
        max: 50,
        required: true
    },
    lastName: {
        type: String,
        min: 2,
        max: 50,
        required: true
    },
    email: {
        type: String,
        max: 50,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: 5,
        required: true,
    },
    picturePath: {
        type: String,
        default: ''
    },
    friends: {
        type: Array,
        default: []
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)
export default User