const bcrypt = require('bcryptjs')

const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  })
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.redirect('/login'); //avviso Utente o pass errato
      }
      bcrypt
        .compare(password, user.password)
        .then(passOK => {
          if (passOK) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login'); //avviso utente o Pass errato
        });
    })
    .catch((err) => console.log(err));
}

exports.postSignup = (req, res, next) => {
  const usrName = req.body.usrName
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  //input validation: DA IMPLEMENTARE DOPO
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect('/signup') //utente gia registrato [AGGIUNGERE AVVISO]
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
        .then((result) => {
          console.log('User Created successfully')
          res.redirect('/login')
        })
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}
