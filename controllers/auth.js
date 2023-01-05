const bcrypt = require('bcryptjs')

const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  let errMsg = req.flash('loginError')
  if (errMsg.length > 0 ) {
    errMsg = errMsg[0]
  } else {
    errMsg = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: errMsg,
  })
}

exports.getSignup = (req, res, next) => {
  let errMsg = req.flash('signupError')
  if (errMsg.length > 0 ) {
    errMsg = errMsg[0]
  } else {
    errMsg = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: errMsg,
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('loginError', 'Email o Password non validi,\n riprova ad effettuare il login!')
        return res.redirect('/login')
      }
      bcrypt
        .compare(password, user.password)
        .then((passOK) => {
          if (passOK) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(() => {
              console.log('Login effettuato con successo')
              res.redirect('/')
            })
          }
          req.flash('loginError', 'Email o Password non validi,\n riprova ad effettuare il login!')
          res.redirect('/login')
        })
        .catch((err) => {
          console.log(err)
          res.redirect('/login')
        })
    })
    .catch((err) => console.log(err))
}

exports.postSignup = (req, res, next) => {
  const usrName = req.body.usrName
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword //input validation: DA IMPLEMENTARE DOPO
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('signupError', 'Utente già registrato!\n Se non ricordi la password reimpostala.')
        return res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            usrName: usrName,
            email: email,
            password: hashedPassword,
            matcheslist: {
              matches: [],
            },
          })
          return user.save()
        })
        .then(() => {
          console.log('Utente creato con successo')
          res.redirect('/login')
        })
    })
    .catch((err) => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    //console.log(err)
    console.log('Logout effettuato con successo')
    res.redirect('/')
  })
}
