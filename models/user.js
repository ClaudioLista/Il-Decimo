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
  matcheslist: {
    quantity: { type: Number, required: true },
    matches: [
      {
        matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
      },
    ],
  },
})

module.exports = mongoose.model('User', userSchema)
