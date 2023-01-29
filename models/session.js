const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  expires: {
    type: Date
  },  
  session: {
    cookie: {
        originalMaxAge: {type: Number},
        expires: {type: Date},
        secure: {type: Boolean},
        httpOnly: {type: Boolean},
        domain: {type: String},
        path: {type: String},
        sameSite: {type: String}
    },
    csrfSecret: {type: String},
    isLoggedIn: {type: Boolean},
    user: {
        nome: {
            type: String
          },
          cognome: {
            type: String
          },
          usrName: {
            type: String,
          },
          email: {
            type: String,
          },
          numCell: {
            type: String
          },
          password: {
            type: String,
          },
          matchNum: {
            type: Number,
          },
          matchList: {
            matchId: {
              type: Schema.Types.ObjectId,
              ref: "Match",
            },
            vote: {
              type: String,
              default: "",
            },
            type: Array,
          },
          role: {
            type: String,
            default: "user",
            enum: ["user", "admin"],
          },
          activeSessions: {
            type: Number,
            default: 0,
          },
          verified: {
            type: Boolean,
            default: false,
          },
          expireAt: { 
            type: Date, 
            default: null,
          },
          lastSession: { 
            type: Date,
          },
      },
      ipAddress: {type: String}
  },
});

module.exports = mongoose.model("Session", sessionSchema);