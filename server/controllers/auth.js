import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'


// REGISTER USER
export const register = async (req, res) => {
   try {
      const {
         firstName,
         lastName,
         location,
         friends,
         occupation,
         email,
         password
      } = req.body

      const { filename } = req.file
      const salt = await bcrypt.genSalt()
      const passwordHash = await bcrypt.hash(password, salt)

      const newUser = new User({
         firstName,
         lastName,
         location,
         friends,
         picturePath: filename,
         occupation,
         email,
         password: passwordHash,
         viewedProfile: Math.floor(Math.random() * 1000),
         impressions: Math.floor(Math.random() * 10_000)
      })
      console.log(newUser)
      const savedUser = await newUser.save()
      res.status(201).json(savedUser)
   } catch (error) {
      res.status(500).json({ error: error.message })
   }
}

//LOGGING IN
export const login = async (req, res) => {
   try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ msg: `User does not exist.` })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ msg: `Invalid credentials.` })

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.status(200).json({ user, token })
   } catch (error) {
      res.status(400).json({ msg: `Error logging in.` })
   }
}
