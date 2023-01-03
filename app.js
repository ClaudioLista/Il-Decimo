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

const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'my secret', //TODO: cambiare il segreto con una stringa molto lunga e complicata
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { 
      maxAge: 100000 //si puo anche togliere
    } 
  }),
) 

app.use((req, res, next) => {
  User.findById('5baa2528563f16379fc8a610')
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => console.log(err))
})

app.use('/admin', adminRoutes)
app.use(userRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Claudio',
          email: 'claudio@test.com',
          matcheslist: {
            matches: [],
          },
        })
        user.save()
      }
    })

    app.listen(3000)
    console.log('ok')
  })
  .catch((err) => {
    console.log(err)
  })
