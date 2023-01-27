const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  accessToken: {
    type: String,
  },
  activeSessions: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otpVerified: {
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

});

userSchema.index( { "expireAt": 1 }, { "expireAfterSeconds": 0 } );

module.exports = mongoose.model("User", userSchema);
