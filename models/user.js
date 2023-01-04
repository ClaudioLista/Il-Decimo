const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  usrName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  matchNum: { 
    type: Number, 
    required: true 
  },
  matchList: {
    type: Schema.Types.ObjectId,
    matches: [
      {
        matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
      },
    ],
    required: true
  },
})

module.exports = mongoose.model('User', userSchema)
