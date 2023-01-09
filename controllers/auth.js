const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')

const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'login',
    errorMessage: '',
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: '',
    oldInput: {
      usrName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: []
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  const errMsg = 'Email o Password non validi, riprova ad effettuare il login!'
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'login',
      errorMessage: errMsg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    })
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'login',
          errorMessage: errMsg,
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        })
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
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'login',
            errorMessage: errMsg,
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          })
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

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        usrName: usrName,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array()
    })
  }
  bcrypt
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
    .catch((err) => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    console.log('Logout effettuato con successo')
    res.redirect('/')
  })
}
