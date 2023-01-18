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
  }
})

module.exports = mongoose.model('User', userSchema)
