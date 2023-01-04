const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const errorController = require('./controllers/error')
const User = require('./models/user')

const MONGODB_URI =
  'mongodb+srv://ildecimo_node:Yqk3cdHnWRypqK7O@ildecimo.f8r39ia.mongodb.net/app'

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
})

app.set('view engine', 'ejs')
app.set('views', 'views')

const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'forza napoli', //TODO: cambiare il segreto con una stringa molto lunga e complicata
    resave: false,
    saveUninitialized: false,
    store: store,
    // cookie: {
    //   maxAge: 100000
    // }
  }),
)

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => console.log(err))
})

app.use(userRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000)
    console.log('ok')
  })
  .catch((err) => {
    console.log(err)
  })
