const path = require("path");

const ChatRoom = require("./models/chatroom");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const passport = require('passport');

const errorController = require("./controllers/error");
const User = require("./models/user");

//const MONGODB_URI = 'mongodb+srv://ildecimo_node:Yqk3cdHnWRypqK7O@ildecimo.f8r39ia.mongodb.net/app'
const MONGODB_URI = "mongodb+srv://ciro:ciro@cluster0.5izgbwo.mongodb.net/app";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "forza napoli", //TODO: cambiare il segreto con una stringa molto lunga e complicata
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 7200000, //la sessione si cancella dopo 2h
      //secure: true  solo in fase di deploy va bene
    }
  })
);
app.use(csrfProtection);
app.use(passport.authenticate('session'));

passport.serializeUser(function(req, user, cb) {
  req.session.user = user;
  req.session.isLoggedIn = true;
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.usrName, email: user.email });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  if(!!req.session.passport) {
    res.locals.isAuthenticated = true;
  }
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(userRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const port = process.env.PORT || 5000
    const server = app.listen(port);
    const io = require("socket.io")(server);
    console.log("Listening on port ", port);

    io.on("connection", (socket) => {       // TODO : modificare i nomi
      socket.on("message", (message) => {
        socket.to(message.room).emit("message", message);   // TODO : modificare i nomi
  
        ChatRoom.findOne({matchId: message.room}).then((room) => {
          room.addMessage(message)
        }).catch((err) => console.log(err));
      });

      socket.on("create or join", (room) => {     // TODO : modificare i nomi
        io.in(room)
          .fetchSockets()
          .then((sockets) => {
            numClients = sockets.length + 1;
            //console.log(`Number of client: ${numClients} in room: ${room}`);      // TODO : modificare i nomi e/o togliere

            if (numClients == 1) {
              socket.join(room);
              socket.emit("created", room);             // TODO : modificare i nomi
            } else {
              io.to(room).emit("remotePeerJoining", room);      // TODO : modificare i nomi
              socket.join(room);
              socket.to(room).emit(
                  "broadcast: joined",                          // TODO : modificare i nomi
                  `client ${socket.id} joined room ${room}`     // TODO : modificare i nomi
                );
              socket.emit("joined", room);                      // TODO : modificare i nomi
            }
          });
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
