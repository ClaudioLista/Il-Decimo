const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5baa2528563f16379fc8a610')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://ildecimo_node:Yqk3cdHnWRypqK7O@ildecimo.f8r39ia.mongodb.net/app?retryWrites=true&w=majority'
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
      name: 'Claudio',
      email: 'claudio@test.com',
      matcheslist: {
        matches: []
      }
    });
    user.save();
      }
    })
    
    app.listen(3000);
    console.log('ok')
  })
  .catch(err => {
    console.log(err);
  });
