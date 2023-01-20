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
    matches: [
      {
        matchId: { 
          type: Schema.Types.ObjectId, 
          ref: 'Match'
        }
      }
    ]
  },
  role: {
    type: String,
    default: 'user',
    enum: ["user", "admin"]
   },
   accessToken: {
    type: String
   }
})

module.exports = mongoose.model('User', userSchema)
