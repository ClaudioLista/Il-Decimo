const path = require("path");

const ChatRoom = require("./models/chatroom");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
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
      expires: 86400*1000/2 //la sessione si cancella dopo 12h
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

app.use(flash());

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
    const server = app.listen(80);
    const io = require("socket.io")(server);
    console.log("Listening on port 80");

    io.on("connection", (socket) => {
      //console.log("user connected");
      
      socket.on("message", (message) => {
        // broadcast the message to all the clients in the room except the sender
        socket.to(message.room).emit("message", message);
  
        ChatRoom.findOne({matchId: message.room}).then((room) => {
          //console.log(message)
          room.addMessage(message)

        }).catch((err) => console.log(err));
      });

      socket.on("create or join", (room) => {
        // The fetchSockets returns a promise
        io.in(room)
          .fetchSockets()
          .then((sockets) => {
            numClients = sockets.length + 1;
            console.log(`Number of client: ${numClients} in room: ${room}`);

            // First client joining (the initiator)
            if (numClients == 1) {
              // rooms are a server-side concept, it's the server that has to join a client to a room
              // a room is created once at least a socket joins it
              socket.join(room);
              // send the message directly to the initiator
              socket.emit("created", room);
              
              // Second client joining
            } else {
              // Inform initiator that another client has joined the same room
              // The client hasn't joined the room yet, so we need to bradcast to all the clients currently in the room (in this case only the initiator)
              io.to(room).emit("remotePeerJoining", room);
              // Let the new peer join room
              socket.join(room);
              // broadcast the message to all the clients in the room except the sender (in this case only to the initiator)
              socket
                .to(room)
                .emit(
                  "broadcast: joined",
                  `client ${socket.id} joined room ${room}`
                );
              // send the message directly to the joiner
              socket.emit("joined", room);
            } 
          });
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
