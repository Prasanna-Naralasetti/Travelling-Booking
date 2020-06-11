const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require('./models/UserModel')
const { auth } = require('./middleware/auth');
const config = require('./config/key');

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(()=> {
    console.log('connected to db')
    
      })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.json({"hello" : "i am happy to deploy"})
})

app.post('/api/users/register', ( req, res )=> {
  const user = new User(req.body)
  user.save(( err, userData )=> {
    if(err) return res.json({success:false,err})
  })
  return res.status(200).json({
    success:true
  })
})

app.post('/api/users/login', (req, res) => {

  // console.log('ping')
  
  User.findOne({ email: req.body.email }, (err, user) => {

    // console.log('user', user)
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

  
    user.comparePassword(req.body.password, (err, isMatch) => {
      // console.log('err',err)

      // console.log('isMatch',isMatch)

      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})


app.get('/api/users/auth', auth, (req, res) => {
  
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})

const port = process.env.PORT || 2000

app.listen(port, () => {
  console.log('listening to port',port)
})