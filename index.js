const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test')
const bcrypt = require('bcryptjs')
const {Schema} = mongoose
const User = mongoose.model('user',new Schema({
    email: String,
    password: String
}))

app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({limit:'10mb',extended:false}))

app.post('/signup', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashPassword
        const user = await User.create(req.body)
        if (user) {
            return res.json({
                success: true,
                message: user
            })
        }
        return res.json({
            success:false,
            message:'failed to add data'
        })
    } catch (error) {
        return res.json(error)
    }
})

app.post('/login', async (req, res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.json({
                success:false,
                message:'invalid email'
            })
        }
        const match = await bcrypt.compare(req.body.password,user.password)
        if(match){
            return res.json({
                success: true,
                message: user,
                match:match
            })
        }
        return res.json({success:false, message:'invalid password'})
        
    } catch (error) {
        return res.json(error)
    }
})

app.listen(port, () => {
    console.log('server successfully started !')
})