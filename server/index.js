import express from 'express'
import expressAsyncError from 'express-async-errors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { register } from './controllers/auth.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { verifyToken } from './middleware/auth.js'
import { createPost } from './controllers/post.js'
import { users, posts } from './seeds/index.js'
import User from './models/User.js'
import Post from './models/Post.js'
const HOST = '172.20.10.2'

/*CONFIGURATIONS*/
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


dotenv.config()

const app = express()
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('dev'))
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/assets", express.static(path.join(__dirname, 'public', 'assets')))


// FILE-STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
        const { originalname } = file
        let ext = path.extname(originalname)
        let filename = `${Math.floor((Math.random() * Math.pow(2, 32)))}${Date.now()}${ext}`
        console.log(`in multer: req.file: `,file)
        cb(null, filename)
    }
})

const upload = multer({ storage })

//ROUTES WITH FILES
app.post('/auth/register', upload.single('picture'), register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)

//ROUTES
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)


//MONGOOSE SETUP
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        // await User.deleteMany()
        // await Post.deleteMany()
        // await User.insertMany(users)
        // await Post.insertMany(posts)
        app.listen(PORT, () => { console.log(`Server listening on ${PORT}\nPress Ctrl-C to terminate.`) })
    })
    .catch((err) => { console.log(`${err} did not connect`) })
