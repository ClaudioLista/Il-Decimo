const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  usrName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  matchNum: {
    type: Number
  },
  matchList: {
    matchId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Match'
    },
    vote: {
      type: String,
      default: ""
    },
    type: Array,
  },
  role: {
    type: String,
    default: 'user',
    enum: ["user", "admin"]
   },
   accessToken: {
    type: String
   },
   activeSessions: {
    type: Number,
    default: 0
   }

})

module.exports = mongoose.model('User', userSchema)
