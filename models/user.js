const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  usrName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  matchNum: {
    type: Number,
    required: false,
  },
  matchList: {
    matches: [
      {
        matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: false },
      },
    ],
    required: false,
  },
})

module.exports = mongoose.model('User', userSchema)
